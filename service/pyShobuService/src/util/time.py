
from time import time

def getNowMs():
    return int( time() * 1000 )

def getNowSeconds():
    return int( time() )
