#-*-coding:utf-8-*-
import sublime
import sublime_plugin
import os
import zipfile


class NcopCompressCommand(sublime_plugin.WindowCommand):
    def run(self, dirs):
        dirname = dirs[0]
        file_list = []
        full_dirname = os.path.abspath(dirname)
        zip_filename = os.path.basename(full_dirname) + '.zip'
        full_zip_filename = os.path.join(os.path.dirname(full_dirname), zip_filename)

        if not os.path.exists(full_dirname):
            sublime.error_message(u'文件夹 %s 不存在!' % full_dirname)
            return
        if os.path.exists(full_zip_filename):
            if not sublime.ok_cancel_dialog(u'文件 %s 已存在，确定覆盖该文件 ? [Y/N]' % full_zip_filename):
                return

        for root, dirlist, files in os.walk(dirname):
            for filename in files:
                file_list.append(os.path.join(root, filename))

        dest_zip = zipfile.ZipFile(full_zip_filename, 'w')
        for f in file_list:
            dest_file = f[len(dirname):]
            sublime.status_message(u'正在压缩文件 %s' % dest_file)
            print f, dest_file
            dest_zip.write(f, dest_file)
        dest_zip.close()
        sublime.status_message(u'压缩完成')

    def is_visible(self, dirs):
        if 0 == len(dirs):
            return False
        app_file_list = os.listdir(dirs[0])
        if 'config.json' in app_file_list:
            return True
        return False
