
import tornado.web
from tornado.options import options

import pymongo
from pymongo import MongoClient

import networkx as nx

import setting

from handler.madb import MADB

from bson import BSON
from bson import json_util


from PIL import Image
import io
import os.path

import json

import subprocess

maDB = MADB();
maDB.connectDB('MA', 'localhost', 27017)

class TestHandler(tornado.web.RequestHandler):
    def get(self, word):
        print('getsurvey handler', word);       
        self.render('index.html')
        # self.write('ok');

class IndexHandler(tornado.web.RequestHandler):
	def get(self):
		self.render('index.html')

class MAdbhandler(tornado.web.RequestHandler):
	def post(self):
		maName = self.get_argument('name')
		record = maDB.getMA(maName);
		record_str = json.loads(json.dumps(record,default=json_util.default))

		result={
			'ma': record_str
		}
		
		self.set_header('Access-Control-Allow-Origin', '*');
		self.write(result)

class SaveMAhandler(tornado.web.RequestHandler):
	def post(self):
		maInfo_str = self.get_argument('ma');
		maInfo = json.loads(maInfo_str);
		print('save ', maInfo_str);
		# print('save !! ', maInfo['name'], maInfo['malist']);
		maDB.saveMA(maInfo);

		self.set_header('Access-Control-Allow-Origin', '*');
		self.write({'save':'ok'})

class GraphHandler(tornado.web.RequestHandler):
	def post(self):
		graph = json.loads(self.get_argument('graph'));
		G = nx.Graph();
		#init graph

		#get the clique
		index = 0;
		for node in graph['nodes']:
			G.add_node(node['id'], group = node['group'])
		for edge in graph['links']:
			G.add_edge(edge['source'], edge['target'], value= edge['value']);
		result = list(nx.find_cliques(G))
		# print('graph ', graph);
		self.write({'result': result})


class EdgeHandler(tornado.web.RequestHandler):
	def post(self):
		G = nx.Graph();
		graph = json.loads(self.get_argument('graph'));
		#get the clique
		index = 0;
		for node in graph['nodes']:
			G.add_node(node['id'], group = node['group'])
		for edge in graph['links']:
			G.add_edge(edge['source'], edge['target'], value= edge['value']);

		degreeMap = G.degree()
		print('degree ', degreeMap);

		#find the most large node
		node_maxDegree = ""
		maxDegree = -1
		for key in degreeMap:
			if(degreeMap[key] > maxDegree):
				maxDegree = degreeMap[key]
				node_maxDegree = key
		print(' max degree and node ', node_maxDegree, maxDegree);

		result = nx.shortest_path(G, source=node_maxDegree);
		# edges = sorted(result.edges(data=True));
		print(result)
		# print('shortest path ', result);
		self.write({'result': result, 'centralnode': node_maxDegree});