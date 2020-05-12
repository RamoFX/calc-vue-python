import eel

eel.init('../frontend')
eel.start('index.html', port=8080, mode='electron', size=(256+64, 424+64))
