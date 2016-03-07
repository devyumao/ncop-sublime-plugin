#-*-coding:utf-8-*-
import sublime
import sublime_plugin
import urllib
import webbrowser
from common.api_call import ApiGet
from ncop.constant import SITE


class NcopSelectionDocCommand(sublime_plugin.TextCommand):
    def run(self, edit):
        keyword = self.get_keyword()
        if keyword:
            self.search(keyword)

    def search(self, keyword):
        url = 'http://developer.nuomi.com/openplatform/api/apisearch'
        params = {'query': keyword}

        def after(res):
            if res['errno']:
                return
            data = res['data']
            if len(data) > 0:
                self.results = data[:10]
                sublime.set_timeout(self.show_quick_panel, 0)

        ApiGet(url, params, after).start()

    def show_quick_panel(self):
        items = [[res['title'], '...' + res['content'] + '...'] for res in self.results]
        window = sublime.active_window()
        window.show_quick_panel(items, self.on_select_item)

    def on_select_item(self, index):
        if index == -1:
            return
        result = self.results[index]
        raw_path = result['path']
        category = urllib.unquote(raw_path).split('/')[4]
        path = urllib.quote(raw_path)
        doc_url = '/'.join([SITE, '#/guide/doc', category, path])
        webbrowser.open_new_tab(doc_url)

    def get_keyword(self):
        for region in self.view.sel():
            if region.empty():
                keyword = self.view.word(region)
                keyword = self.view.substr(keyword)
            else:
                keyword = self.view.substr(region)
        return keyword

    def is_visible(self):
        return len(self.get_keyword()) > 0

# class NcopInputDocCommand(sublime_plugin.WindowCommand):
#     def run(self):
#         self.window.show_input_panel(
#             '搜索组件化文档:',
#             '',
#             self.on_done,
#             self.on_change,
#             self.on_cancel
#         )

#     def on_done(self, input):
#         search_on_site()

#     def on_change(self, input):
#         pass

#     def on_cancel(self):
#         pass
