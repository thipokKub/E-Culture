from flask import Flask,request,jsonify,render_template
# from preprocess import Preprocessing
from flask_cors import CORS
from flask_pymongo import PyMongo
# from model import EnsembleTextCNN
# from product_model import MyProductModel
from bson import json_util, ObjectId
import numpy as np
import json
import gridfs

app = Flask(__name__, template_folder="build", static_folder="build/static")
app.config["MONGO_URI"] = "mongodb://localhost:27017/essenseDB"
mongo = PyMongo(app)
CORS(app)
fs = gridfs.GridFS(mongo.db)
Projects = mongo.db.projects
# dp = Preprocessing()
# sentiment_ensemble_model = EnsembleTextCNN('model/weights.001-0.9655.hdf5','model/weights.003-0.9798.hdf5',0.8)
# product_model = MyProductModel('model/filter_level_1-002-0.8675.hdf5','model/non_filter_level_1-002-0.8391.hdf5')

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