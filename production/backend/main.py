import eel

eel.init('../../production/frontend/')

@eel.expose
def calcExp(exp):
  """
  1. prepare an expression for calculating,
     - trim spaces
     - replace math keyword with math functions (deg --> MATH_MODULE.degrees)
  2. return error or calculated value as response
  """

  # normalize the expression
  exp = exp.lower()

  # replace this to that
  for k, v in {
    ' ':    '',
    ',':    '.',

    'sqrt': 'm.sqrt',

    'deg':  'm.degrees',
    'rad':  'm.radians',

    'sin':  'm.sin',
    'asin': 'm.asin',
    'cos':  'm.cos',
    'acos': 'm.acos',
    'tan':  'm.tan',
    'atan': 'm.atan'
  }.items():
    exp = exp.replace(k, v)

  # try to evaluate the expression
  import math as m

  response = None

  try:
    response = {
      'status': 'ok',
      'details': eval(exp)
    }

  except Exception as e:
    import sys

    response = {
      'status': 'error',
      'details': str(sys.exc_info()[1])
    }

  finally:
    import json

    return json.dumps(response)

eel.start('index.html', block=False)

while True:
  eel.sleep(5.0)
