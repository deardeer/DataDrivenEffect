#!/usr/bin/env python
#coding:utf-8

import sys
# from imp import reload
# reload(sys)
# sys.setdefaultencoding('utf-8')

from handler.pointhandler import IndexHandler
from handler.pointhandler import MAMindmapHandler
from handler.pointhandler import MAMinardHandler
from handler.pointhandler import MAPlayfairHandler

url=[
	(r'/', IndexHandler),
    (r'/MAmindmap', MAMindmapHandler),
    (r'/MAminard', MAMinardHandler),
    (r'/MAfair', MAPlayfairHandler)

]