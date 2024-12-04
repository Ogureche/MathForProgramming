import tkinter as tk
import random

maze_size = 10  # Размер лабиринта
cell_size = 40  # Размер клетки
player_x, player_y = 0, 0  # Начальная позиция игрока

# Предопределённый лабиринт: 
# 1 - стена, 0 - пустая клетка, 2 - замедляющее препятствие, 
# 3 - опасное препятствие, 4 - телепортирующее препятствие
maze = [
    [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 2, 1, 1, 1, 0, 1, 2, 2],
    [0, 1, 0, 0, 0, 0, 0, 1, 0, 0],
    [0, 1, 1, 1, 0, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 1, 0],
    [0, 1, 3, 1, 0, 1, 4, 1, 1, 0],
    [2, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 0, 1, 0],
    [0, 0, 0, 0, 1, 0, 1, 0, 0, 0],
    [1, 1, 1, 1, 1, 0, 0, 0, 1, 0],
]

root = tk.Tk()
root.title("Лабиринт с препятствиями")
canvas = tk.Canvas(root, width=maze_size * cell_size, height=maze_size * cell_size)
canvas.pack()

# Функция для отрисовки лабиринта
def draw_maze():
    canvas.delete("all")
    for y in range(maze_size):
        for x in range(maze_size):
            if maze[y][x] == 1:
                color = "black"  # стена
            elif maze[y][x] == 2:
                color = "yellow"  # замедляющее препятствие
            elif maze[y][x] == 3:
                color = "red"  # опасное препятствие
            elif maze[y][x] == 4:
                color = "purple"  # телепорт
            else:
                color = "white"  # пустая клетка
            canvas.create_rectangle(
                x * cell_size, y * cell_size,
                (x + 1) * cell_size, (y + 1) * cell_size,
                fill=color
            )
    canvas.create_rectangle(
        player_x * cell_size, player_y * cell_size,
        (player_x + 1) * cell_size, (player_y + 1) * cell_size,
        fill="blue"
    )

# Обработка движения игрока
def move_player(event):
    global player_x, player_y
    new_x, new_y = player_x, player_y

    if event.keysym == 'Up':
        new_y -= 1
    elif event.keysym == 'Down':
        new_y += 1
    elif event.keysym == 'Left':
        new_x -= 1
    elif event.keysym == 'Right':
        new_x += 1

    # Проверка на границы и стены
    if 0 <= new_x < maze_size and 0 <= new_y < maze_size:
        if maze[new_y][new_x] == 0:  # пустая клетка
            player_x, player_y = new_x, new_y
        elif maze[new_y][new_x] == 2:  # замедляющее препятствие
            player_x, player_y = new_x, new_y
            root.after(500)  # небольшая задержка
        elif maze[new_y][new_x] == 3:  # опасное препятствие
            player_x, player_y = 0, 0  # возвращаем игрока на старт
        elif maze[new_y][new_x] == 4:  # телепорт
            player_x, player_y = random.randint(0, maze_size - 1), random.randint(0, maze_size - 1)
    draw_maze()

# Привязка событий
root.bind("<KeyPress>", move_player) 

# Рисуем лабиринт при запуске
draw_maze()
root.mainloop()
