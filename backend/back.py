from flask import Flask,request,jsonify,render_template
from flask_cors import CORS
# from flask_pymongo import PyMongo
from bson import json_util, ObjectId
from gensim.models.doc2vec import Doc2Vec
import pandas as pd
import numpy as np
import json
import re
from dialogflow import detect_intent_texts
from pythainlp import word_tokenize
from dataset import map_id_to_category,map_id_to_media,dataset
import recommendation
from math import sin, cos, sqrt, atan2, radians

app = Flask(__name__, template_folder="build", static_folder="build/static")
CORS(app)
recommender = recommendation.recommender()

def getPicture(input_id):
    results = map_media[mep_media[id] == input_id]
    
model = Doc2Vec.load('doc2vec_model')

def cleanText(text):
    text = re.sub('[^ก-๙\s0-9]','',text)
    text = re.sub('[\n\t]','',text)
    text = re.sub('[\s]+',' ',text)
    return text


@app.route("/api/getIntention",methods=['POST'])
def classifyText():
    data = json.loads(request.data.decode('utf-8'))
    text = data['text']
    print('text',text)
    res = detect_intent_texts(
                project_id="ehack-fc084",
                session_id="mosaku",
                texts=[text],
                language_code="th"
                )
    intent = res.query_result.intent.display_name
    res_text = res.query_result.fulfillment_text
    return jsonify({'intent':intent, 'text':res_text}) , 200


@app.route("/app/search", methods=["POST"])
def search():
    data = json.loads(request.data.decode('utf-8'))
    text = data['text']
    print("TEXT", text ,"##########")
    # results = model.docvecs.most_similar([model.infer_vector(tokenized_words)], topn = 5)
    results = recommender(text)

    selected = dataset[dataset["id"].isin(results)]
    # selected["description"] = selected['description'].apply(lambda des : cleanText(des))
    selected['media'] = selected['id'].apply(lambda id : map_id_to_media[id])
    selected['category'] = selected['id'].apply(lambda id : map_id_to_category[id])

    obj = json.loads(selected.to_json(orient='records', force_ascii=False))    
    return jsonify(obj), 200


@app.route("/api/getDescription", methods=["POST"])
def describe():
    title = json.loads(request.data.decode('utf-8'))['title']
    ret = data[data["title"] == title].to_json(orient='records', force_ascii=False)
    ret['media'] = ret['id'].apply(lambda id : map_id_to_media[id])
    ret['category'] = ret['id'].apply(lambda id : map_id_to_category[id])
    obj = json.loads(ret.to_json(orient='records', force_ascii=False))     
    return jsonify(obj), 200


def euclidean_dist(slat, slon, elat, elon):
    inf = 2e9
    R = 6373.0

    try:
        slat = float(slat)
        slon = float(slon)
        elat = float(elat)
        elon = float(elon)
    except:
        return inf

    slat = radians(slat)
    slon = radians(slon)
    elat = radians(elat)
    elon = radians(elon)

    dlon = elon - slon
    dlat = elat - slat

    a = sin(dlat / 2)**2 + cos(slat) * cos(elat) * sin(dlon / 2)**2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))
    distance = R * c

    return distance


@app.route("/api/getRecommend", methods=["POST"])
def recommend():
    topn = 10
    data = json.loads(request.data.decode('utf-8'))
    slat = float(data['lat'])
    slon = float(data['lon'])
    ret = dataset.copy()
    ret['dist'] = ret.apply(lambda row : euclidean_dist(slat,slon, row['lat'], row['lon']),axis=1)
    ret = ret.sort_values(by=['dist'])
    # ret["description"] = ret['description'].apply(lambda des : cleanText(str(des)))
    ret['media'] = ret['id'].apply(lambda id : map_id_to_media[id])
    ret['category'] = ret['id'].apply(lambda id : map_id_to_category[id])
    obj = json.loads(ret.to_json(orient='records', force_ascii=False))[:topn]
    return jsonify(obj), 200

if __name__ == "__main__":    
    app.run(host="0.0.0.0",debug=True)
    
