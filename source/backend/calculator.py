import time

time_log = True
time_start = time.perf_counter() if time_log else None


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
  replacers = {
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
  }

  for k, v in replacers.items():
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
      'status': 'ok',
      'details': str(sys.exc_info()[0])
    }

  finally:
    import json

    return json.dumps(response)


userInput = 'sin(90s)'
result =  calcExp(userInput)

print(result)


print(f'Executed in { time.perf_counter() - time_start }ms') if time_log else None
