import requests
import os
from dotenv import load_dotenv

load_dotenv()

API_KEY = '22f0e8997a62c95182b69839beeaefe9'


def obter_dados_climaticos(cidade):
    url_base = f"http://api.openweathermap.org/data/2.5/weather?q={cidade}&appid={API_KEY}&units=metric"
    resposta = requests.get(url_base)
    dados = resposta.json()
    return dados

def obter_qualidade_ar(lat, lon):
    url_ar = f"http://api.openweathermap.org/data/2.5/air_pollution?lat={lat}&lon={lon}&appid={API_KEY}"
    resposta = requests.get(url_ar)
    dados_ar = resposta.json()
    return dados_ar
