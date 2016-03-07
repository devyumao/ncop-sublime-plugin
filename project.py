#-*-coding:utf-8-*-
import sublime
import sublime_plugin
import os
import re
import json
import functools
import base64
import webbrowser
from watchdog.events import FileSystemEventHandler
from common import settings
from common.api_call import ApiPost
from common.util import compress
from ncop import nfile, project, watch
from ncop.constant import SITE, URLS


class ProjectEventHandler(FileSystemEventHandler):
    def __init__(self, path):
        FileSystemEventHandler.__init__(self)
        self.path = path
        self.id = project.get_id(path)

    def process(self, event):
        print event.src_path, event.event_type

    def on_modified(self, event):
        self.process(event)
        if os.path.isfile(event.src_path):
            nfile.put(self.id, self.path, event.src_path)

    def on_created(self, event):
        self.process(event)
        if os.path.isfile(event.src_path):
            nfile.put(self.id, self.path, event.src_path)
        else:
            nfile.mkdir(self.id, self.path, event.src_path)

    def on_moved(self, event):
        self.process(event)
        if event.src_path != self.path:
            nfile.delete(self.id, self.path, event.src_path)
            if os.path.isfile(event.src_path):
                nfile.put(self.id, self.path, event.src_path)
            else:
                nfile.mkdir(self.id, self.path, event.src_path)

    def on_deleted(self, event):
        self.process(event)
        # src_path = event.src_path
        # if src_path != self.path and os.path.basename(event.src_path) != 'mock.json':
        if event.src_path != self.path:
            nfile.delete(self.id, self.path, event.src_path)


def isProjectDir(path):
    sign_loc = os.path.join(path, settings.project_sign)
    return os.path.isfile(sign_loc)


# 测试用
class NcopTest(sublime_plugin.WindowCommand):
    def run(self):
        sublime.status_message('loading...')
        for view in sublime.active_window().views:
            print view


class EventListener(sublime_plugin.EventListener):
    def on_activated(self, view):
        # TODO: class
        status_key = 'ncop_watch'
        file_name = view.file_name()
        if not file_name:
            return
        if watch.is_being_watched(file_name):
            view.set_status(status_key, u'====同步中====')
        elif view.get_status(status_key):
            view.erase_status(status_key)


class NcopCreateProjectCommand(sublime_plugin.WindowCommand):
    def run(self, dirs):
        self.window.show_input_panel(u'项目名称:', '', functools.partial(self.on_done, dirs[0]), None, None)

    def on_done(self, path, name):
        def after_create():
            project.preview(project.get_id(path))

        project.create(path, name, after_create)

    def is_visible(self, dirs):
        return len(dirs) == 1 and not isProjectDir(dirs[0])


class NcopWatchCommand(sublime_plugin.WindowCommand):
    def run(self, dirs):
        path = dirs[0]

        def watch_project():
            watch.start(path, ProjectEventHandler(path))
            sublime.set_timeout(set_status, 0)

            id = project.get_id(path)

            def after_fetch(res):
                if res['errno']:
                    return
                data = res['data']
                project.set_info(id, {
                    'online_prefix': SITE + data['onlineprefix'],
                    'mobile_prefix': 'bainuo://component?url=' + SITE + data['mobileprefix'],
                    'params': data['param']
                })

            project.fetch_info(id, after_fetch)

        def set_status():
            active_view = self.window.active_view()
            if watch.is_being_watched(active_view.file_name(), path):
                active_view.set_status('ncop_watch', u'====同步中====')

        if os.path.isfile(os.path.join(path, settings.project_sign)):
            watch_project()
        else:
            project.create(path, os.path.basename(path), watch_project)

    def is_visible(self, dirs):
        return len(dirs) == 1 and not watch.is_alive(dirs[0])


class NcopStopWatching(sublime_plugin.WindowCommand):
    def run(self, dirs):
        path = dirs[0]

        def stop():
            active_view = self.window.active_view()
            if watch.is_being_watched(active_view.file_name(), path):
                active_view.erase_status('ncop_watch')
            watch.stop(path)

        sublime.set_timeout(stop, 0)

    def is_visible(self, dirs):
        return len(dirs) == 1 and watch.is_alive(dirs[0])


class NcopDebugOnline(sublime_plugin.WindowCommand):
    def run(self, dirs):
        project.preview(project.get_id(dirs[0]))

    def is_visible(self, dirs):
        return len(dirs) == 1 and isProjectDir(dirs[0])


class NcopDeleteProjectCommand(sublime_plugin.WindowCommand):
    def run(self, dirs):
        self.window.run_command('ncop_stop_watching', {'dirs': dirs})
        project.delete(dirs[0])

    def is_visible(self, dirs):
        return len(dirs) == 1 and isProjectDir(dirs[0])


class NcopGenerateConfig(sublime_plugin.WindowCommand):
    def run(self, dirs):
        path = dirs[0]
        self.window.show_input_panel(u'组件名称:', '', functools.partial(self.on_done, dirs[0]), None, None)

        pages = []
        for dirpath, dirnames, filenames in os.walk(path):
            for filename in filenames:
                if not re.search('\.html$', filename):
                    continue
                fullname = os.path.join(dirpath, filename)
                relpath = os.path.relpath(fullname, path)
                name = filename[:-len('.html')]
                pages.append({
                    'name': name,
                    'file': relpath,
                    'login': False
                })
        self.config = {
            'id': None,
            'version': None,
            'pages': pages
        }

    def on_done(self, path, name):
        self.config['id'] = name

        url = URLS['CONFIG_API']
        params = {
            'product_id': 1,
            'component_name': name,
            'info_type': 1
        }

        def after(res):
            if res['errno']:
                return
            self.config['version'] = res['data']['version']
            f = open(os.path.join(path, 'config.json'), 'w')
            f.write(json.dumps(self.config, indent=4))
            f.close()

        ApiPost(url, params, after).start()

    def is_visible(self, dirs):
        return len(dirs) == 1


class NcopUploadPackage(sublime_plugin.WindowCommand):
    def run(self, dirs):
        path = dirs[0]
        zippath = compress(path)
        f = open(zippath, 'rb')
        bs = base64.encodestring(f.read())
        f.close()

        url = 'http://devtest.nuomi.com/openplatform/release/filesave'
        params = {
            'fileType': '.zip',
            'token': settings.token,
            'componentName': project.get_comp_name(path),
            'bs': bs}

        def after(res):
            os.remove(zippath)
            if res['errno']:
                return
            webbrowser.open_new_tab('http://devtest.nuomi.com/#/package/list?istest=1')

        ApiPost(url, params, after).start()

    def is_visible(self, dirs):
        return len(dirs) == 1 and os.path.isfile(os.path.join(dirs[0], 'config.json'))
