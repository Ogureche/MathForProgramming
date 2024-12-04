import tkinter as tk
from queue import Queue, PriorityQueue
import time

# Размеры лабиринта
maze_size = 10
cell_size = 40

# Три лабиринта
mazes = [
    [
        [0, 1, 0, 0, 0, 0, 0, 1, 0, 0],
        [0, 1, 0, 1, 1, 1, 0, 1, 0, 0],
        [0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
        [0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
        [0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
        [0, 1, 1, 1, 1, 1, 0, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 0, 1, 0],
        [0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
        [1, 1, 1, 1, 1, 0, 0, 0, 1, 0],
    ],
    [
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
        [1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
        [1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
        [1, 0, 1, 1, 0, 1, 1, 1, 0, 1],
        [1, 0, 1, 1, 0, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 1, 1, 1, 1, 1, 0],
        [1, 1, 1, 0, 0, 0, 0, 1, 0, 0],
        [1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
        [1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
    ],
    [
        [0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
        [1, 1, 0, 1, 1, 0, 1, 1, 1, 1],
        [1, 1, 0, 1, 1, 0, 0, 0, 0, 1],
        [1, 1, 0, 1, 1, 1, 1, 1, 0, 1],
        [1, 1, 0, 1, 1, 1, 1, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
        [1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
        [1, 0, 0, 0, 1, 1, 0, 0, 0, 1],
        [1, 1, 1, 0, 0, 0, 0, 1, 0, 0],
    ],
]

# Начальная и конечная позиции
start = (0, 0)
end = (9, 9)

# Алгоритмы поиска
def bfs(maze, start, end):
    queue = Queue()
    queue.put((start, [start]))
    visited = set()
    visited.add(start)

    while not queue.empty():
        current, path = queue.get()
        if current == end:
            return path

        x, y = current
        for dx, dy in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
            nx, ny = x + dx, y + dy
            if 0 <= nx < maze_size and 0 <= ny < maze_size and (nx, ny) not in visited and maze[ny][nx] == 0:
                queue.put(((nx, ny), path + [(nx, ny)]))
                visited.add((nx, ny))
    return []

def a_star(maze, start, end):
    def heuristic(a, b):
        return abs(a[0] - b[0]) + abs(a[1] - b[1])

    open_set = PriorityQueue()
    open_set.put((0, start))
    came_from = {}
    g_score = {start: 0}
    f_score = {start: heuristic(start, end)}

    while not open_set.empty():
        _, current = open_set.get()

        if current == end:
            path = []
            while current in came_from:
                path.append(current)
                current = came_from[current]
            return path[::-1]

        x, y = current
        for dx, dy in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
            neighbor = (x + dx, y + dy)
            if 0 <= neighbor[0] < maze_size and 0 <= neighbor[1] < maze_size and maze[neighbor[1]][neighbor[0]] == 0:
                tentative_g_score = g_score[current] + 1
                if neighbor not in g_score or tentative_g_score < g_score[neighbor]:
                    came_from[neighbor] = current
                    g_score[neighbor] = tentative_g_score
                    f_score[neighbor] = g_score[neighbor] + heuristic(neighbor, end)
                    open_set.put((f_score[neighbor], neighbor))
    return []

def greedy(maze, start, end):
    def heuristic(a, b):
        return abs(a[0] - b[0]) + abs(a[1] - b[1])

    open_set = PriorityQueue()
    open_set.put((heuristic(start, end), start))
    came_from = {}
    visited = set()
    visited.add(start)

    while not open_set.empty():
        _, current = open_set.get()

        if current == end:
            path = []
            while current in came_from:
                path.append(current)
                current = came_from[current]
            return path[::-1]

        x, y = current
        for dx, dy in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
            neighbor = (x + dx, y + dy)
            if 0 <= neighbor[0] < maze_size and 0 <= neighbor[1] < maze_size and maze[neighbor[1]][neighbor[0]] == 0 and neighbor not in visited:
                came_from[neighbor] = current
                visited.add(neighbor)
                open_set.put((heuristic(neighbor, end), neighbor))
    return []

# Рисование лабиринта
def draw_maze(maze, path=[]):
    canvas.delete("all")
    for y in range(maze_size):
        for x in range(maze_size):
            color = "black" if maze[y][x] == 1 else "white"
            canvas.create_rectangle(
                x * cell_size, y * cell_size,
                (x + 1) * cell_size, (y + 1) * cell_size,
                fill=color
            )
    for px, py in path:
        canvas.create_rectangle(
            px * cell_size, py * cell_size,
            (px + 1) * cell_size, (py + 1) * cell_size,
            fill="blue"
        )
    canvas.create_rectangle(
        start[0] * cell_size, start[1] * cell_size,
        (start[0] + 1) * cell_size, (start[1] + 1) * cell_size,
        fill="green"
    )
    canvas.create_rectangle(
        end[0] * cell_size, end[1] * cell_size,
        (end[0] + 1) * cell_size, (end[1] + 1) * cell_size,
        fill="red"
)


# Отображение лабиринтов
root = tk.Tk()
canvas = tk.Canvas(root, width=maze_size * cell_size, height=maze_size * cell_size)
canvas.pack()

# Алгоритмы для каждого лабиринта
algorithms = [bfs, a_star, greedy]
algorithms_names = ["BFS", "A*", "Greedy"]

# Обработка каждого лабиринта с каждым алгоритмом
for maze in mazes:
    for algorithm, name in zip(algorithms, algorithms_names):
        print(f"Решение для алгоритма {name} на текущем лабиринте:")
        
        # Отображаем лабиринт
        draw_maze(maze)
        root.update()
        time.sleep(1)  # Задержка перед началом поиска

        # Выполняем алгоритм
        start_time = time.perf_counter()
        path = algorithm(maze, start, end)
        end_time = time.perf_counter()

        elapsed_time = end_time - start_time
        print(f"Время выполнения {name}: {elapsed_time:.4f} сек")

        # Отображаем путь анимацией
        for step in path:
            draw_maze(maze, path[:path.index(step) + 1])
            root.update()
            time.sleep(0.1)  # Задержка для анимации

root.mainloop() 





