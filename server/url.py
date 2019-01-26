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
from handler.pointhandler import MABoxplotHandler
from handler.pointhandler import GACirclepackingHandler
from handler.pointhandler import GATreemapHandler
from handler.pointhandler import GDMatrixHandler
from handler.pointhandler import GDScatterplotHandler
from handler.pointhandler import GDPathHandler

url=[
	(r'/', IndexHandler),
    (r'/MAmindmap', MAMindmapHandler),
    (r'/MAminard', MAMinardHandler),
    (r'/MAfair', MAPlayfairHandler),
    (r'/MABoxplot', MABoxplotHandler),
    (r'/GACirclepacking', GACirclepackingHandler),
    (r'/GATreemap', GATreemapHandler),
    (r'/GDMatrix', GDMatrixHandler),
    (r'/GDScatterplot', GDScatterplotHandler),
    (r'/GDPath', GDPathHandler),
]