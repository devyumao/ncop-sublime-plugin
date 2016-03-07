#-*-coding:utf-8-*-
from threading import Thread
import urllib
import urllib2
import json
from poster.encode import multipart_encode
from poster.streaminghttp import register_openers


class ApiCall(Thread):
    def __init__(self, url, params=None, callback=None):
        Thread.__init__(self)
        self.url = url
        self.params = params
        self.callback = callback

    def run(self):
        response = self._get_response()
        res_str = response.read().decode('utf-8')
        print res_str
        if self.callback:
            try:
                res = json.loads(res_str)
            except:
                res = res_str
            self.callback(res)


class ApiGet(ApiCall):
    def _get_response(self):
        query = urllib.urlencode(self.params)
        return urllib.urlopen(self.url + '?' + query)


class ApiPost(ApiCall):
    def _get_response(self):
        query = urllib.urlencode(self.params)
        return urllib.urlopen(self.url, query)


register_openers()


class ApiUpload(ApiCall):
    def _get_response(self):
        datagen, headers = multipart_encode(self.params)
        request = urllib2.Request(self.url, datagen, headers)
        return urllib2.urlopen(request)

    # def run(self):
    #     datagen, headers = multipart_encode(self.params)
    #     request = urllib2.Request(self.url, datagen, headers)
    #     res_str = urllib2.urlopen(request).read().decode('utf-8')
    #     res = json.loads(res_str)
    #     self.callback(res)
