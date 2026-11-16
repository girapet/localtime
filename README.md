## Local Time
A local time clock for mobile devices.

### Requirements
This application requires a GPS/GNSS receiver.

### Presentation

#### Title Bar
Shows the current mode, either Local Apparent Time or Local Mean Time.  See the Wikipedia articles [Solar Time](https://en.wikipedia.org/wiki/Solar_time) and [Equation of Time](https://en.wikipedia.org/wiki/Equation_of_time) for an explanation of the difference between these. Also shows the current longitude of the device.

#### Local Time
In hours, minutes, and seconds for the current mode.

#### Sun Progress Dial
Shows the progress of the sun through the dawn, sunlit, dusk, and night hours.  Noon is at the top of the dial, midnight at the bottom.  The amount of daylight or night remaining is shown in the center.  The dial was originally designed for [Camino Del Sol](https://github.com/girapet/caminodelsol).  This is a complete recoding.

#### Today's Sun Events
Gives times in the current mode for the start of dawn, sunrise, solar noon, sunset, end of dusk, and solar midnight.

#### Local Time Offsets
Shows the offsets between the time in current mode and 
* the time in the current time zone of the device
* the time in the other mode

### Settings
* **Mode** - either Local Apparent Time or Local Mean Time
* **Clock Type** - either 12-hour (AM/PM) or 24-hour format

### Accuracy
The timing of this app was compared to values computed in the [Horizons System](https://ssd.jpl.nasa.gov/horizons/app.html) at the Jet Propulsion Laboratory and the [Solar Ephemeris Calculator](https://www.kso.ac.at/beobachtungen/ephemeris_en.php) at the University of Graz, Germany.  It matched local solar noon in both systems to about one second.

100% written by the author.  No frameworks.  No AI.