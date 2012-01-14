//save references to commonly-used math functions
m = Math, R = m.random, P = m.pow,
//set the canvas dimensions and store them
D = c.width = c.height = 600,
//some constants
t = 12, T = D - t, O = 256,
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

//the main loop
setInterval(function () {
	//if there are no more exploded balls AND,
	// the target has been reached, OR
	// the user already clicked, and the target hasn't been reached
	//  (in which case, decrement the level counter, to mimick a lose)
	//the level has been won/lost
	if (!E && (e >= N || (L && e < N && l--))) {
		//reset
		e = L = 0;
		A = [];

		//number of balls in level: 5*level
		A.length = ++l * 5;
		//target balls in level: level-th triangular number
		N = l * (l + 1) / 2;
		//NOTE: after level 9, N > A.length
		//better formulas for these variable needs to be found
	}
	//clear the board. if the user won, make it a festive color!
	a.fillStyle = e < N ? '#778' : '#eef';
	a.fillRect(0, 0, D, D);
	//draw the score
	a.strokeText(e + '/' + N, 9, 9);

	//iterate over the array
	//this loop combines two things: creating the balls on new levels/click,
	// and updating the balls
	i = A.length;
	while (i--) {

	//if the current element isn't set, then fill it with a new ball
	with (A[i] || (A[i] = {
		s : L, //state. 0 = move, 1 = expand, 2 = shrink
		M : R() * 40 + 20, //max radius
		x : L ? L.clientX : R() * T + 6, //random, or click location
		y : L ? L.clientY : R() * T + 6, //what ^ said
		v : R() * t - 6, //-3 <= dx <= 3
		z : R() * t - 6, //-3 <= dy <= 3
		C : 'rgb(' + [R() * O | 0, R() * O | 0, R() * O | 0].join() + ')',
		r : 6, //start radius
		//interval between the ball's expanded state and beginning to shrink
		t : 30 / l | 0
	})) {
		//hit test. skip if the ball is already exploded
		!s && A.some(function(o) {
			//pythagoras for hit-test, don't test if the other ball's exploded
			return o.s && P(r + o.r, 2) > P(x - o.x, 2) + P(y - o.y, 2) && (s = 1, E++, e++);
		});
		//state's falsy, move the ball!
		if (!s) {
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
	//user hasn't clicked
	if (!L) {
		L = e;
		E++;
		A.push(0); //trick to create another ball in the main loop
	}
};
