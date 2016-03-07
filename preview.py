#-*-coding:utf-8-*-
import sublime
import sublime_plugin
import os
import json
import webbrowser
import urllib
from ncop import project, watch


class NcopPreviewPageCommand(sublime_plugin.TextCommand):
    def run(self, edit):
        file_path = self.view.file_name()
        project_path = watch.get_observer_path(file_path)
        config_path = os.path.join(project_path, 'config.json')
        if not project_path or not os.path.isfile(config_path):
            return

        f = open(config_path, 'r')
        config = json.loads(f.read())
        f.close()

        self.pages = config['pages']
        self.show_quick_panel()

    def show_quick_panel(self):
        self.items = [[page['name'], page['file']] for page in self.pages]
        window = sublime.active_window()
        window.show_quick_panel(self.items, self.on_select_item)

    def on_select_item(self, index):
        if index == -1:
            return
        file_path = self.view.file_name()
        project_path = watch.get_observer_path(file_path)
        id = project.get_id(project_path)
        info = project.get_info(id)
        page_file = self.items[index][1]

        params = info['params']
        url = self.get_url(
            info[self.prefix_key],
            page_file,
            params['page_path'] if page_file in params else None
        )
        webbrowser.open_new_tab(url)

    def get_url(self, prefix, page_file, query):
        url = prefix + page_file
        if query:
            url += '?' + query
        return url

    def is_visible(self):
        return watch.get_observer_path(self.view.file_name())


class NcopPreviewPageByBrowser(NcopPreviewPageCommand):
    prefix_key = 'online_prefix'


class NcopPreviewPageByQrcode(NcopPreviewPageCommand):
    prefix_key = 'mobile_prefix'

    def get_url(self, prefix, page_file, query):
        url = prefix + page_file
        if query:
            url += '&' + query
        return 'http://devtest.nuomi.com/#/page/qrcode?url=' + urllib.quote(url)
