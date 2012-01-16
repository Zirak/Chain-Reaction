//save references to commonly-used math functions
m = Math, R = m.random, P = m.pow,
//set the canvas dimensions and store them
D = c.width = c.height = 600,
//constants:
// T = 600 - 12, used in ball coords generation
// O = max rgb value, used in ball color generation
T = D - 12, O = 256,
//the srsbsns variables:
// l = level
// e = overall exploded count in level
// E = how many balls are currently exploded
// N = target for level
l = e = E = N = 0;
//there are two other gravely important variables, which'll be implicitly
//declared later:
// A = an array of all balls in the level
// L = whether a user clicked in the level. this isn't a real boolean value,
//  but a falsy/truthy representation. the truthy value with be a MouseEvent
// n = number of balls present in level

//main loop
//will be turned into setInterval( string ) in the build script to weed off extra bytes
setInterval(function() {
	//if there are no more exploded balls AND,
	// the target has been reached, OR
	// the user already clicked, and the target hasn't been reached
	//  (in which case, decrement the level counter, to mimick a lose)
	//the level has been won/lost
	if (!E && (e >= N || (L && e < N && l--))) {
		//reset
		e = L = 0;
		A = [];

		//requirement and ball-count generation
		n = (N = ++l * (l + 1) / 2) + 5;
		//the requirement is the level-th traingular number
		//the ball-count is the requirement + 5
		//linear, I know, but it's the best I found. not too hard too fast, not too easy too soon.
	}
	//clear the board. if the user won, make it a festive color!
	a.fillStyle = e < N ? '#a41' : '#c73';
	a.fillRect(0, 0, D, D);
	//draw the score
	a.strokeText(e + '/' + N, 9, 9);

	//iterate over the array
	//this loop combines two things: creating the balls on new levels/click,
	// and updating the balls
	i = Z;
	while (--i) {

		//if the current element isn't set, then fill it with a new ball
		with (A[i] || (A[i] = {
			//state. 0 = move, 1 = expand, 2 = shrink
			s : L,
			//max radius
			M : R() * 40 + 20,
			//random, or click location
			x : L ? L.clientX : R() * T + 6,
			//what he ^ said
			y : L ? L.clientY : R() * T + 6,
			//-3 <= dx <= 3
			v : R() * 12 - 6,
			//-3 <= dy <= 3
			z : R() * 12 - 6,
			//random rgb color
			C : 'rgb(' + [R() * O | 0, R() * O | 0, R() * O | 0] + ')',
			//start radius
			r : 6,
			//interval between the ball's expanded state and beginning to shrink
			//decreases each level
			t : 30 / l | 0
		})) {

			//state's falsy, update la ball
			if (!s) {
				//hit test
				A.some(function(o) {
					//simple pythagoras, don't test if the other ball's exploded
					return o.s && P(r + o.r, 2) > P(x - o.x, 2) + P(y - o.y, 2) && (s = 1, E++, e++);
				});

				//update positions. if the ball surpasses the boundaries, change
				// the specific delta
				//uses bit-trickey which Alnitak and copy gave in the SO chatroom
				//false | false = 0, true | true = 1
				//a -2 * a = -a
				x += v *= 1 - 2 * (x < r | x+r > D);
				y += z *= 1 - 2 * (y < r | y+r > D);

			//the timer clocked out, start shrinking
			} else if (!t) {
				if (!--r) {
					A.splice(i, 1);
					Z--;
					E--;
				}

			//s == 2, start decrementing the timer
			} else if (s > 1) {
				t--;

			//if it's not any of those, then expand
			} else {
				if (++r > M) {
					s = 2;
				}
			}

			//draw the ball
			a.beginPath();
			a.fillStyle = C;
			a.arc(x, y, r, 0, 7);
			a.fill();
		}};
}, 50);

c.onclick = function(e) {
	//if L is falsy, the user hasn't used his click
	//increment the exploded count and the ball-num counter
	L || (L = e, E++, Z++);
};