import zipfile
import os


def compress(path):
    zippath = path + '.zip'
    f = zipfile.ZipFile(zippath, 'w')
    for dirpath, dirnames, filenames in os.walk(path):
        for filename in filenames:
            fullname = os.path.join(dirpath, filename)
            f.write(fullname, fullname[len(path):])
    f.close()
    return zippath
