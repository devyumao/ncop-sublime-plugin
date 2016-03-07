#-*-coding:utf-8-*-
import os
import webbrowser
import json
import urllib
from common import settings
from common.api_call import ApiUpload, ApiPost
from common.util import compress
from ncop.constant import URLS, SITE
from ncop import nfile


project_dict = dict()


def get_id(path):
    sign_loc = os.path.join(path, settings.project_sign)
    sign_file = open(sign_loc, 'r')
    project_id = int(sign_file.read())
    sign_file.close()
    return project_id


def create(path, name, callback=None):
    # 请求前新建 .log 文件解决空压缩包问题
    # 不使用 .ncdt 文件：因为该文件为判断项目的标志位
    log_file = open(os.path.join(path, '.log'), 'w')
    log_file.close()

    zippath = compress(path)

    url = URLS['ADD_PROJECT']
    params = {
        'user_token': settings.token,
        'project_name': name,
        'file': open(zippath, 'rb')
    }

    print params

    def after_upload(res):
        # 删除本地压缩
        os.remove(zippath)

        if res['errno']:
            return

        # 记录 ID

        sign_loc = os.path.join(path, settings.project_sign)
        sign_file = open(sign_loc, 'w')
        project_id = res['data']['id']
        sign_file.write(str(project_id))
        sign_file.close()

        # 取得默认文件

        nfile.get_and_write(project_id, 'mock.json', path, callback)
        nfile.get_and_write(project_id, 'extra.js', path)

    ApiUpload(url, params, after_upload).start()


def delete(path, callback=None):
    url = URLS['DELETE_PROJECT']
    params = {
        'user_token': settings.token,
        'id': get_id(path)
    }

    def after_delete(res):
        if res['errno']:
            return
        os.remove(os.path.join(path, settings.project_sign))
        callback and callback()

    ApiPost(url, params, after_delete).start()


def get_comp_name(path):
    f = open(os.path.join(path, 'config.json'), 'r')
    name = json.loads(f.read())['id']
    f.close()
    return name


def fetch_info(id, callback):
    query = urllib.urlencode({
        'id': id,
        'nocloud': 1
        })
    url = URLS['DEBUG_PROJECT'] + '?' + query
    params = {'user_token': settings.token}
    ApiPost(url, params, callback).start()


def get_info(id):
    return project_dict[id]


def set_info(id, info):
    project_dict[id] = info


def preview(id):
    webbrowser.open_new_tab(SITE + '/#/guide/debugger/' + str(id))
