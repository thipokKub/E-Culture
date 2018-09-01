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

app = Flask(__name__, template_folder="build", static_folder="build/static")
CORS(app)

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
    return jsonify({'intent':intent}) , 200


@app.route("/api/getRecommend", methods=["POST"])
def recommend():
    text = json.loads(request.data.decode('utf-8'))['text']
    tokenized_words = word_tokenize(cleanText(text))
    results = model.docvecs.most_similar([model.infer_vector(tokenized_words)], topn = 5)
    
    select = np.zeros(dataset.shape[0], dtype=np.bool)
    for r,p in results:
        select[r] = True
    
    res = dataset[select]
    res["description"] = res['description'].apply(lambda des : cleanText(des))
    obj = json.loads(res.to_json(orient='records', force_ascii=False))    
    return jsonify(obj), 200


@app.route("/api/getDescription", methods=["POST"])
def describe():
    title = json.loads(request.data.decode('utf-8'))['title']
    ret = data[data["title"] == title].to_json(orient='records', force_ascii=False)
    ret['media'] = ret['id'].apply(lambda id : map_id_to_media[id])
    ret['category'] = ret['id'].apply(lambda id : map_id_to_category[id])
    obj = json.loads(ret.to_json(orient='records', force_ascii=False)) 
    return jsonify(ret), 200

if __name__ == "__main__":
    app.run(debug=True)
