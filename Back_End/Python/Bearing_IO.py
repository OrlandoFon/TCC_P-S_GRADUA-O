#%%
import natsort
import glob
from os import listdir
import os
from os.path import isfile, join
import time
import re
import pandas as pd

import matplotlib.pyplot as plt
import numpy as np

# Define caminho dos arquivos.
mypath = "/home/orlandofonsecad/Downloads/IMS/IMS/3rd_test/4th_test"

# Define lógica para fazer a listagem de todos os arquivos no diretorio.
files = glob.glob(join(mypath, "**/*"), recursive=True)
files = [f for f in files if os.path.isfile(f)]

# Faz com que a listagem dos arquivos esteja em ordem crescente, seguindo o padrão qual foram medidos os dados dos sensores.
files_sorted = natsort.natsorted(files,reverse=False)

df = pd.DataFrame()
# Realiza a leitura de linha a linha dos arquivos.
# for y in range(len(files_sorted)):
with open(files_sorted[0]) as f:
    lines = f.readlines()

    for x in range(len(lines)):
        # Organiza os canais na medição linha a linha. Para tanto, retirando o \t (tab) presente entre os canais, os seprando e removendo o \n (nova linha) no final da listagem.
        line_sorted = ''.join(lines[x])
        line_sorted = re.sub('\s+', ' ', line_sorted).split(' ')
        del line_sorted[-1]
        # Gera um dicionario com os valores da medição da linha separados por canal e acrescenta a um DataFrame.
        lst_dict = []
        lst_dict.append({'Canal 1':float(line_sorted[0]), 'Canal 2':float(line_sorted[1]), 'Canal 3': float(line_sorted[2]), 'Canal 4': float(line_sorted[3])})
        df = df._append(lst_dict)
    
    df = df.reset_index(drop=True)
    