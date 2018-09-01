from flask import Flask,request,jsonify,render_template
from flask_cors import CORS
from flask_pymongo import PyMongo
from bson import json_util, ObjectId
from gensim.models.doc2vec import Doc2Vec
import numpy as np
import json
import re

app = Flask(__name__, template_folder="build", static_folder="build/static")
#app.config["MONGO_URI"] = "mongodb://localhost:27017/essenseDB"
mongo = PyMongo(app)
CORS(app)
Projects = mongo.db.projects
dataset = pd.read_csv('ภาคเหนือ_part1.csv')
dataset2 = pd.read_csv('ภาคเหนือ_part2.csv')
dataset3 = pd.read_csv('ภาคเหนือ_part3.csv')
dataset = dataset.append(dataset2)
dataset = dataset.append(dataset3)
Doc2Vec.load('doc2vec_model')

def cleanText(text):
    text = re.sub('[^ก-๙\s]','',des)
    text = re.sub('[\n\t]','',des)
    text = re.sub('[\s]+',' ',des)
    return text


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    return render_template('index.html')

@app.route("/project/create",methods=['POST'])
def createProject():
    data = json.loads(request.data.decode('utf-8'))
    obj = {}
    if (len(data['keywords']) == 0 or len(data['projName']) == 0):
        obj['isSuccess'] = False
        obj['errMsg'] = 'Please fill the form correctly'
        return jsonify(obj) , 200
    obj['isSuccess'] = True
    obj['errMsg'] = ''
    Projects.insert_one(data)
    return jsonify(obj) , 200

@app.route("/project/delete",methods=['POST'])
def delProject():
    data = json.loads(request.data.decode('utf-8'))
    obj = {}
    print(data)
    obj['fb'] = Projects.remove({'_id':ObjectId(data['_id'])})
    return jsonify(obj) , 200

@app.route("/project/get",methods=['GET'])
def getProject():
    docs =  Projects.find({})
    obj = {}
    obj['docs'] = json.loads(json_util.dumps(docs))
    return jsonify(obj) , 200

@app.route("/upload/csv",methods=['POST'])
def upload_csv():
    file = request.files['file']
    pid = request.form['pid']
    obj = {}
    if (file.filename.split('.')[1] in ['.csv']):
        obj['isSuccess'] = True
        obj['errMsg'] = ''
        fs.put(file,filename=file.filename,content_type=file.content_type,pid=ObjectId(pid))
        return jsonify(obj) , 200
    elif (file.filename == ''):
        obj['isSuccess'] = False
        obj['errMsg'] = 'please put some file'
        return jsonify(obj) , 200
    else:
        obj['isSuccess'] = False
        obj['errMsg'] = 'file is not support'
        return jsonify(obj) , 200

# @app.route("/predict/sentiment2",methods=['POST'])
# def predict_sentiment2():
#     global sentiment_ensemble_model
#     data = json.loads(request.data)
#     text = data['text']
#     feature = dp.create_feature(text,200)
#     ans = sentiment_ensemble_model.predict(feature)
#     ans2 = product_model.predict(feature)
#     obj = {}
#     obj['sentiment'] = str(ans)
#     obj['product'] = str(ans2)
#     return jsonify(obj),201

# @app.route("/dev/speech2text",methods=['POST'])
# def speech2text():
#     obj = request.form
#     print('form',obj)
#     print('file',request.files)
#     return '',201

if __name__ == "__main__":
    app.run()
