from flask import request, jsonify, Blueprint

from servicos import obter_dados_climaticos, obter_qualidade_ar

app = Blueprint('api', __name__)

@app.route('/api/clima', methods=['POST'])
def clima():
    data = request.json
    cidade = data.get('cidade')

    if not cidade:
        return jsonify({'erro': 'Cidade não fornecida'}), 400

    clima_dados = obter_dados_climaticos(cidade)
    if 'cod' in clima_dados and clima_dados['cod'] != 200:
        return jsonify({'erro': clima_dados.get('message', 'Erro ao obter dados climáticos')}), 404

    lat = clima_dados['coord']['lat']
    lon = clima_dados['coord']['lon']
    qualidade_ar_dados = obter_qualidade_ar(lat, lon)

    return jsonify({
        'clima': clima_dados,
        'qualidade_ar': qualidade_ar_dados
    })
