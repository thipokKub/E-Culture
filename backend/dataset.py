import pandas as pd
import numpy as np
from collections import defaultdict

dataset = pd.read_csv('dataset/culture/ภาคเหนือ/ภาคเหนือ_part1.csv',encoding='utf-8')
dataset = dataset.append(pd.read_csv('dataset/culture/ภาคเหนือ/ภาคเหนือ_part2.csv',encoding='utf-8'))
dataset = dataset.append(pd.read_csv('dataset/culture/ภาคเหนือ/ภาคเหนือ_part3.csv',encoding='utf-8'))
dataset = dataset.drop_duplicates(['description'])

map_id_to_category = defaultdict(lambda : [])
def check_category(row):
    map_id_to_category[row['id']].append(row['category'])
    return row

dataset.apply(lambda row : check_category(row),axis=1)
dataset.drop(['category'],axis=1,inplace=True)

dataset_media = pd.read_csv('dataset/media/north_media.csv',encoding='utf-8')

map_id_to_media = defaultdict(lambda : [])
def check_media(row):
    map_id_to_media[row['id']].append({'thumb_pic':row['thumb_pic'],'big_pic':row['big_pic']})
    return row
dataset_media.apply(lambda row : check_media(row),axis=1)