# A-Maze-Generator-and-visualizer
- A maze generator algorism using back tracking, Depth-first search using JS and visualized by HTML and CSS.

- Legacy code from my second year of university to solve mazes. I created a Java API listening on https://sudo-delete-web-service-maze-solver-api.onrender.com that receives a 2D array of strings an return a string of the pass from enterance to the exit. Created a Docker and deployed on Render.

- JAVA-Server API: [https://a-maze-generator-and-visualizer.vercel.app/](https://github.com/AndrewidRizk/Maze-Solver)
# Details 
**Depth-first search (DFS)** is an algorithm for traversing or searching tree or graph data structures. The algorithm starts at the root node (selecting some arbitrary node as the root node in the case of a graph) and explores as far as possible along each branch before backtracking. Extra memory, usually a stack, is needed to keep track of the nodes discovered so far along a specified branch which helps in backtracking of the graph.


![Depth-first-tree svg](https://user-images.githubusercontent.com/97995173/213224341-7518f5c2-36f0-43cf-8c1c-aed943a89085.png)

# Source read more 📖
https://en.wikipedia.org/wiki/Depth-first_search

# Sending to the API
in the back end of this code i also generated a 2D array conestracting the maze such that a block is:
1) open from the top   -->		 0111
2) open from the left		--> 1011
3) open from the bottom 	--> 1101
4) open from the right		--> 1110 


![image](https://user-images.githubusercontent.com/97995173/213239530-d38c0478-8437-40b5-ae90-583ae839ebca.png)


- corresponds to 

![image](https://user-images.githubusercontent.com/97995173/213239822-c8aba7e3-0785-4d73-aa85-3ff37d2e8088.png)


- Then fetch the soution of the maze from my JAVA-API as following
```
fetch('https://sudo-delete-web-service-maze-solver-api.onrender.com/solve', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(mazeData)
      })
      .then(response => response.text())
      .then(result => {
        console.log('Solution:', result);
        const coordinatesArray = parseCoordinates(result);
        console.log(coordinatesArray);
        newMaze.changePathColor(coordinatesArray)
    })
      .catch(error => {
          console.error('Error solving maze:', error);
      });
```

- Then after receiving the answer. I visualize it to look like that.

  ![image](https://github.com/AndrewidRizk/A-Maze-Generator-and-visualizer/assets/97995173/5db098ac-fee5-41da-b40b-7e2a2ba425b7)



