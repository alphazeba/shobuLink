import src.util.jsonHelp as j
from decimal import Decimal

if True:
    objWithDecimal = {
        "test": {
            "x": Decimal(100),
            "y": "string"
        },
        "other" : [
            Decimal( 25 ),
            21,
            "asdf"
        ]
    }
    stringForm = j.dumps( objWithDecimal )
    objFormAgain = j.loads( stringForm )
    assert objWithDecimal == objFormAgain