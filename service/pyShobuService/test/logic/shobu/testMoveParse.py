import src.logic.shobu.moveParser as mp
import src.logic.shobu.move as m

if True:
    testMove = "Wa1b2Wa1b2"
    parsedMove = mp.parseMove( testMove )
    unParsedMove = mp.moveToString( parsedMove )
    assert( testMove == unParsedMove )

if True:
    testMove = "Wa1b2Wa1b2"
    parsedMove = mp.parseMove( testMove )
    x,y = m.getSpot( m.moveGetPassive( parsedMove ) )
    assert( x == 0 and y == 3 )