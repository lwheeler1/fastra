import * as React from 'react';
import BigCalendar from 'react-big-calendar'

const velocity = require('velocity-react');


export class PracticeComp extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			menuArrowArr: []
		};
	}

	render() {
		return (
		<div>
			<div className="topBanner">
				<h1>Wheeler Schedule</ h1>
			</div>
			<div className="leftColumn">
				<h1>left</ h1>
			</div>
			<div className="dateTimes">
				<h3 className="timeSlot">Day:</h3>
				<h3 className="timeSlot">07:00--</h3>
				<h3 className="timeSlot">08:00--</h3>
				<h3 className="timeSlot">09:00--</h3>
				<h3 className="timeSlot">10:00--</h3>
				<h3 className="timeSlot">11:00--</h3>
				<h3 className="timeSlot">12:00--</h3>
				<h3 className="timeSlot">01:00--</h3>
				<h3 className="timeSlot">02:00--</h3>
				<h3 className="timeSlot">03:00--</h3>
				<h3 className="timeSlot">04:00--</h3>
				<h3 className="timeSlot">05:00--</h3>
				<h3 className="timeSlot">06:00--</h3>
				<h3 className="timeSlot">07:00--</h3>
				<h3 className="timeSlot">08:00--</h3>
				<h3 className="timeSlot">09:00--</h3>
			</div>
				<div className="sun">
					<h1 className="daySlot">Sun</h1>

				</div>
				<div className="mon">
					<h1 className="daySlot">Mon</h1>
					<button class="onehrButton">Click to reserve!</button>
					<button class="onehrfiveminButton">Click to reserve!</button>
					<div className="tenmins"> </div>
					<button class="onehrfiveminButton">Click to reserve!</button>
					<div className="tenmins"> </div>
					<button class="onehrfiveminButton">Click to reserve!</button>
					<div className="fivemins"> </div>
					<button class="onehrfiftyminButton">Click to reserve!</button>
					<div className="fivemins"> </div>
					<button class="onehrfiveminButton">Click to reserve!</button>
					<div className="tenmins"> </div>
					<button class="onehrfiveminButton">Click to reserve!</button>
					<div className="fivemins"> </div>
					<button class="onehrfiftyminButton">Click to reserve!</button>
					<div className="tenmins"> </div>
					<button class="threehrButton">Click to reserve!</button>
				</div>
				<div className="tue">
					<h3 className="daySlot">Tue</h3>
				</div>
				<div className="wed">
					<h3 className="daySlot">Wed</h3>
					<button class="onehrButton">Click to reserve!</button>
					<button class="onehrfiveminButton">Click to reserve!</button>
					<div className="tenmins"> </div>
					<button class="onehrfiveminButton">Click to reserve!</button>
					<div className="tenmins"> </div>
					<button class="onehrfiveminButton">Click to reserve!</button>
					<div className="fivemins"> </div>
					<button class="onehrfiftyminButton">Click to reserve!</button>
					<div className="fivemins"> </div>
					<button class="onehrfiveminButton">Click to reserve!</button>
					<div className="tenmins"> </div>
					<button class="onehrfiveminButton">Click to reserve!</button>
					<div className="fivemins"> </div>
					<button class="onehrfiftyminButton">Click to reserve!</button>
					<div className="tenmins"> </div>
					<button class="threehrButton">Click to reserve!</button>
				</div>
				<div className="thu">
					<h3 className="daySlot">Thu</h3>
				</div>
				<div className="fri">
					<h3 className="daySlot">Fri</h3>
					<button class="onehrButton">Click to reserve!</button>
					<button class="onehrfiveminButton">Click to reserve!</button>
					<div className="tenmins"> </div>
					<button class="onehrfiveminButton">Click to reserve!</button>
					<div className="tenmins"> </div>
					<button class="onehrfiveminButton">Click to reserve!</button>
					<div className="fivemins"> </div>
					<button class="onehrfiftyminButton">Click to reserve!</button>
					<div className="fivemins"> </div>
					<button class="onehrfiveminButton">Click to reserve!</button>
					<div className="tenmins"> </div>
					<button class="onehrfiveminButton">Click to reserve!</button>
					<div className="fivemins"> </div>
					<button class="onehrfiftyminButton">Click to reserve!</button>
					<div className="tenmins"> </div>
					<button class="threehrButton">Click to reserve!</button>
				</div>
				<div className="sat">
					<h3 className="daySlot">Sat</h3>
				</div>
			<div className="rightColumn">
				<h1>right</ h1>
			</div>
		</div>
		)
	}

}
