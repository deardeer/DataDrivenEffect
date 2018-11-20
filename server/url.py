#!/usr/bin/env python
#coding:utf-8

import sys
# from imp import reload
# reload(sys)
# sys.setdefaultencoding('utf-8')

from handler.pointhandler import IndexHandler
from handler.pointhandler import TestHandler
from handler.pointhandler import MAdbhandler
from handler.pointhandler import SaveMAhandler
from handler.pointhandler import GraphHandler
from handler.pointhandler import EdgeHandler

url=[
	(r'/', IndexHandler),
    (r'/test/(\w+)', TestHandler),
    (r'/saveMA', SaveMAhandler),
    (r'/fetchMA', MAdbhandler),

    #graph    
    (r'/findClique', GraphHandler),
    (r'/findEdge', EdgeHandler),
]