import base64
import os
from common import settings
from common.api_call import ApiGet, ApiPost
from ncop.constant import URLS


def getBase64Content(file_path):
    f = open(file_path, 'r')
    content = base64.b64encode(f.read())
    f.close()
    return content


def save_changes(project_id):
    url = URLS['SAVE_CHANGES']
    params = {
        'user_token': settings.token,
        'id': project_id
    }
    ApiGet(url, params).start()


def put(project_id, project_path, file_path):
    print 'PUT FILE'
    url = URLS['PUT_FILE_CONTENT']
    params = {
        'user_token': settings.token,
        'id': project_id,
        'file': os.path.relpath(file_path, project_path),
        'content': getBase64Content(file_path)
    }

    def after(res):
        if res['errno'] != 0:
            return
        save_changes(project_id)

    ApiPost(url, params, after).start()


def delete(project_id, project_path, file_path):
    url = URLS['DELETE_FILE']
    params = {
        'user_token': settings.token,
        'id': project_id,
        'file': os.path.relpath(file_path, project_path)
    }

    def after(res):
        if res['errno'] != 0:
            return
        save_changes(project_id)

    ApiPost(url, params, after).start()


def mkdir(project_id, project_path, file_path):
    print 'ADD DIR'
    url = URLS['ADD_DIR']
    params = {
        'user_token': settings.token,
        'id': project_id,
        'dir': os.path.relpath(file_path, project_path)
    }

    def after(res):
        if res['errno'] != 0:
            return
        save_changes(project_id)

    ApiPost(url, params, after).start()


def get_and_write(project_id, filename, path, callback=None):
    file_loc = os.path.join(path, filename)
    if os.path.isfile(file_loc):
        if callback is not None:
            callback()
        return

    url = URLS['GET_FILE_CONTENT']
    params = {
        'user_token': settings.token,
        'id': project_id,
        'file': filename
    }

    def after_get_content(res):
        f = open(file_loc, 'w')
        content = base64.b64decode(res)
        f.write(content)
        f.close()

        if callback is not None:
            callback()

    ApiPost(url, params, after_get_content).start()
