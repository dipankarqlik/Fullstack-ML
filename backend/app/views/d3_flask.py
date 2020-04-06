from flask import Blueprint, render_template
import matplotlib
matplotlib.use('Agg')
import json
from flask import Flask, flash, request, redirect, url_for, render_template, jsonify, send_file, make_response
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
import pickle as p
from sklearn.cluster import KMeans

d3_flask = Blueprint('d3_flask', __name__, static_folder='static')


@d3_flask.route('/')
def index():
    return render_template('spotify.html')

@d3_flask.route('/cl')
def newindex():
    return render_template('clustering.html')

@d3_flask.route('/cl3')
def newindex2():
    return render_template('clustering3.html')

@d3_flask.route('/cl4')
def newindex3():
    return render_template('clustering4.html')

@d3_flask.route('/parallel')
def newindex4():
    return render_template('parallel.html')

@d3_flask.route('/uploadfile', methods=['POST'])
def upload():
    if request.method == 'POST':
        f = request.files['file']
        r = pd.read_csv(f)
        if 'variety' in r.columns:
            return render_template('iris.html')
        elif 'target' in r.columns:
            return render_template('spotify.html')
        global jsonfiles
        jsonfiles = json.loads(r.to_json(orient='records'))
        print(jsonfiles)
        jsonify(jsonfiles)
        getnewfile()
    return render_template("freshpage_k.html")

@d3_flask.route('/getnewfile', methods=['GET'])
def getnewfile():
    json_file = jsonify(jsonfiles)
    return json_file


# EXTERNAL REFERENCE: https://towardsdatascience.com/python-plotting-api-expose-your-scientific-python-plots-through-a-flask-api-31ec7555c4a8
@d3_flask.route('/plots/correlation_matrix', methods=['GET'])
def corr():
    dataset = pd.read_csv(f'./app/static/winequality-red.csv')
    var_ds=(dataset[dataset.columns[len(dataset.columns)-1]].unique())
    datasets = {}
    grouping = dataset.groupby(dataset[dataset.columns[len(dataset.columns)-1]])
    for i, j in grouping:
        datasets[i] = j
    for z in var_ds:
        plt.figure()
        plot = sns.heatmap(datasets[z].corr(),annot=True)
        # plot.figure.savefig("/Users/dipankarmazumdar/Documents/Visual Analytics/image/"+ str(i) + ".png")
        plot.figure.savefig(f"./app/templates/image/" + str(z) + ".png")



   # file_name = '/Users/dipankarmazumdar/Documents/Visual Analytics/image/3' +  '.png'
    #file_name = 'templates/image/3' + '.png'
    return "Success"

@d3_flask.route('/plots/image<id>')
def share_img(id):
    file_name = 'templates/image/' + id + '.png'
    return send_file(file_name,
        mimetype='image/png')


@d3_flask.route('/plots/correlation_matrix/iris', methods=['GET'])
def corrnew():
    dataset = pd.read_csv(f'./app/static/iris.csv')
    var_ds=(dataset[dataset.columns[len(dataset.columns)-1]].unique())
    datasets = {}
    grouping = dataset.groupby(dataset[dataset.columns[len(dataset.columns)-1]])
    for i, j in grouping:
        datasets[i] = j
    for z in var_ds:
        plt.figure()
        plot = sns.heatmap(datasets[z].corr(),annot=True)
        # plot.figure.savefig("/Users/dipankarmazumdar/Documents/Visual Analytics/image/"+ str(i) + ".png")
        plot.figure.savefig(f"./app/templates/image/iris" + str(z) + ".png")
    return "Success"

@d3_flask.route('/plots/new/<id>')
def share_img_new(id):
    file_name = 'templates/image/' + id + '.png'
    return send_file(file_name,
        mimetype='image/png')

@d3_flask.route('/cluster/new', methods=['POST'])
def cluster_new_param():
        dataset = pd.read_csv(f'./app/static/spotify.csv')
        ds_new = pd.read_csv(f'./app/static/spotify_base.csv')
        X = dataset.iloc[:, :-1].values
        json_data = json.loads(request.data)
        n_clusters = json_data['n_clusters']
        print(n_clusters)
        km = KMeans(
            n_clusters=n_clusters, init='k-means++',
            n_init=10, max_iter=300,
            tol=1e-04, random_state=0
        )
        y_km = km.fit_predict(X)
        ds_new['prediction'] = y_km
        ds_new.to_csv(f'./app/static/predictedn' + str(n_clusters) + '.csv', index=False)
        return "You have successfully applied clustering with " + str(n_clusters) + " params" + " Please click on Clustering results"











if __name__ == '__main__':
   app.run(debug = True)
