
from exception.ExceptionToReturn import ExceptionToReturn

def getOptionalValue( key, event, default ):
    if key in event:
        return event[key]
    return default

def getValidatedMapKey( key, event, map ):
    fn = lambda value: _validateOptions( key, value, map.keys() )
    return _getValidatedValue( key, event, fn )

def getValidatedRangeValue( key, event, min, max ):
    fn = lambda value: _validateRange( key, value, min, max )
    return _getValidatedValue( key, event, fn )

def getValidatedOptionValue( key, event, options ):
    fn = lambda value: _validateOptions( key, value, options )
    return _getValidatedValue( key, event, fn )

def getValidatedStringValue( key, event ):
    fn = lambda value: _validateString( key, value )
    return _getValidatedValue( key, event, fn )

_invalidInputStatus = 403

def _getValidatedValue( key, event, validationFn ):
    if key not in event:
        raise ExceptionToReturn( "Missing item in request: " + key , _invalidInputStatus )
    value = event[key]
    validationFn( value )
    return value

def _validateRange( key, value, min, max ):
    if not ( min <= value and value <= max ):
        raise ExceptionToReturn( "Value outside range: " + key + " must be within (inclusive) " + str(min) + " and " + str(max), _invalidInputStatus )

def _validateOptions( key, value, options ):
    if value not in options:
        raise ExceptionToReturn( "Value must be in the list of options: " + key + " must be in " + str( options ), _invalidInputStatus  )

def _validateString( key, value ):
    if not isinstance( value, str ):
        raise ExceptionToReturn( "Value must be string: " + key, _invalidInputStatus  )
