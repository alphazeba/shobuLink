
import util_time as time


def new( fullMove ):
    return {
        "time": time.getNow(),
        "fullMove": fullMove
    }