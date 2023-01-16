
import logic_shobu_token as t

def vectorToUnitAndSteps( vector ):
    x,y = vector
    if max( abs( x ), abs( y ) ) == 2:
        return (x/2,y/2),2
    return (x,y),1

def tokenIsEnemy( token, player ):
    return token != t.EMPTY and token != player

def compareVec( veca, vecb ):
    ax,ay = veca 
    bx,by = vecb 
    return ax == bx and ay == by 

def addSpotVec( spot, vec ):
    x,y = spot 
    dx,dy = vec 
    return ( x + dx, y + dy )

def getDeltaVector( a, b ):
    ax,ay = a
    bx,by = b 
    return ( bx - ax, by - ay )

def spotIsInBoard( spot ):
    x,y = spot 
    return x >= 0 and y >= 0 and x < 4 and y < 4