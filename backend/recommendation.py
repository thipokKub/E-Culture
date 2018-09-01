import pickle
import os
import re

from pythainlp.word_vector import thai2vec
from pythainlp.tokenize import word_tokenize
from pythainlp.corpus import stopwords

import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity


class recommender:
    def __init__(self, model_path='./model'):            
        self.load_data(model_path)
        
        
    def load_data(self, model_path):
        try:            
            # print('path',(os.path.join(model_path,"row2id.pk")))
            print('loading data...')
            self.row2id = dict(pickle.load(open(os.path.join(model_path,"row2id.pk"), "rb")))
            self.row2vec = pickle.load(open(os.path.join(model_path,"row2vec.pk"), "rb"))
            self.id2row = dict(pickle.load(open(os.path.join(model_path,"id2row.pk"), "rb")))
            self.word2vec = thai2vec.get_model()

        except Exception as E:
            print (E)
            print('missing dataset...')
            

    def cleanText(self,sents):
        sents = [ re.sub('[^ก-๙\s]','',sent) for sent in sents]
        sents = [ re.sub('[\n\t]','',sent) for sent in sents]
        sents = [ re.sub('[\s]+',' ',sent) for sent in sents]
        return sents


    def tokenized(self, text):
        tokenize = word_tokenize(text)
        out = []
        for word in tokenize:
            if (word != ' '):
                out.append(word)
        
        out = self.remove_stop_word(out)
        return out


    def remove_stop_word(self,words):
        stop_words = stopwords.words('thai') + ['']
        return [w for w in words if w not in stop_words]


    def sentence_vectorizer(self,tokenized, model=None, use_mean=True):                
        dim=300
        vec = np.zeros((1,dim))
        for word in tokenized:
            if word in model.index2word:
                vec+= model.word_vec(word)
            else: pass
        if use_mean: vec /= len(tokenized)
        return vec


    def recommend(self, sent, row2vec, topn=10):
        print("ENTER ############")
        cleaned = self.cleanText([sent])[0]    
        tokens = self.tokenized(cleaned)
        vector = self.sentence_vectorizer(tokens, model=self.word2vec)
        similar = []
        for i,v in enumerate(row2vec):
            try:
                similar.append((cosine_similarity(v,vector),i))
            except:            
                pass
        print(len(similar))
        similar = sorted(similar, reverse=True)[:topn]
        results = []
        for p, row in similar:
            results.append(self.row2id[row])
        print(results)
        return results

    
    def __call__(self, sentence):
        return self.recommend(sent=sentence, row2vec=self.row2vec)