#-*-coding:utf-8-*-
import sublime
import sublime_plugin
from common import settings


class NcopEditTokenCommand(sublime_plugin.WindowCommand):
    def run(self):
        self.window.show_input_panel(u'填写 token:', '', self.on_done, None, None)

    def on_done(self, token):
        settings.settings.set('token', token)
        sublime.save_settings('ncop.sublime-settings')
