(function () {
  "use strict";

  function slug(value) {
    return String(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }

  function p(name, franchise, season, role, batting, bowling, fielding, leadership, overseas, wicketkeeper, tier, style, form) {
    return {
      id: slug(franchise + "-" + season + "-" + name),
      name,
      franchise,
      season,
      role,
      batting,
      bowling,
      fielding,
      leadership,
      overseas: Boolean(overseas),
      wicketkeeper: Boolean(wicketkeeper),
      tier,
      style,
      form
    };
  }

  var teams = [
    { code: "MI", name: "Mumbai Indians", ground: "Wankhede Stadium", accent: "#48a7ff" },
    { code: "CSK", name: "Chennai Super Kings", ground: "M. A. Chidambaram Stadium", accent: "#f7c948" },
    { code: "RCB", name: "Royal Challengers Bengaluru", ground: "M. Chinnaswamy Stadium", accent: "#d94848" },
    { code: "KKR", name: "Kolkata Knight Riders", ground: "Eden Gardens", accent: "#8c6ff7" },
    { code: "SRH", name: "Sunrisers Hyderabad", ground: "Rajiv Gandhi International Stadium", accent: "#ff8a3d" },
    { code: "RR", name: "Rajasthan Royals", ground: "Sawai Mansingh Stadium", accent: "#f063a6" },
    { code: "PBKS", name: "Punjab Kings", ground: "PCA New Stadium", accent: "#e5484d" },
    { code: "DC", name: "Delhi Capitals", ground: "Arun Jaitley Stadium", accent: "#5aa9ff" },
    { code: "GT", name: "Gujarat Titans", ground: "Narendra Modi Stadium", accent: "#d8b45d" },
    { code: "LSG", name: "Lucknow Super Giants", ground: "Ekana Cricket Stadium", accent: "#56d4d8" }
  ];

  var players = [
    p("Rohit Sharma", "MI", 2013, "Opener", 88, 22, 84, 94, false, false, "S", "none", 87),
    p("Kieron Pollard", "MI", 2013, "Finisher", 86, 74, 88, 82, true, false, "S", "pace", 86),
    p("Lasith Malinga", "MI", 2013, "Death Bowler", 18, 96, 78, 70, true, false, "S", "pace", 91),
    p("Harbhajan Singh", "MI", 2013, "Off Spinner", 50, 84, 76, 76, false, false, "A", "spin", 78),
    p("Dinesh Karthik", "MI", 2013, "Wicketkeeper", 76, 12, 78, 64, false, true, "B", "none", 74),
    p("Mitchell Johnson", "MI", 2013, "Strike Bowler", 24, 88, 75, 62, true, false, "A", "pace", 82),
    p("Ambati Rayudu", "MI", 2013, "Middle Order", 78, 10, 74, 60, false, false, "B", "none", 76),
    p("Pragyan Ojha", "MI", 2013, "Left Arm Spinner", 16, 80, 70, 56, false, false, "B", "spin", 72),

    p("Rohit Sharma", "MI", 2020, "Opener", 90, 18, 83, 95, false, false, "S", "none", 88),
    p("Quinton de Kock", "MI", 2020, "Wicketkeeper Opener", 86, 8, 82, 66, true, true, "A", "none", 84),
    p("Suryakumar Yadav", "MI", 2020, "360 Batter", 91, 18, 86, 70, false, false, "S", "none", 89),
    p("Ishan Kishan", "MI", 2020, "Wicketkeeper Batter", 82, 8, 80, 61, false, true, "A", "none", 81),
    p("Hardik Pandya", "MI", 2020, "Pace All-rounder", 84, 82, 85, 84, false, false, "S", "pace", 86),
    p("Krunal Pandya", "MI", 2020, "Spin All-rounder", 72, 78, 82, 70, false, false, "B", "spin", 76),
    p("Jasprit Bumrah", "MI", 2020, "Death Bowler", 16, 98, 82, 80, false, false, "S", "pace", 94),
    p("Trent Boult", "MI", 2020, "Swing Bowler", 18, 90, 78, 65, true, false, "A", "pace", 87),
    p("Rahul Chahar", "MI", 2020, "Leg Spinner", 22, 79, 72, 56, false, false, "B", "spin", 76),
    p("Nathan Coulter-Nile", "MI", 2020, "Pace Bowler", 42, 78, 76, 58, true, false, "B", "pace", 72),

    p("Tilak Varma", "MI", 2023, "Middle Order", 81, 28, 80, 58, false, false, "A", "spin", 80),
    p("Tim David", "MI", 2023, "Finisher", 80, 20, 75, 58, true, false, "B", "none", 75),
    p("Cameron Green", "MI", 2023, "Pace All-rounder", 83, 78, 82, 64, true, false, "A", "pace", 80),
    p("Piyush Chawla", "MI", 2023, "Leg Spinner", 36, 81, 70, 62, false, false, "B", "spin", 77),
    p("Akash Madhwal", "MI", 2023, "Death Bowler", 12, 76, 68, 50, false, false, "C", "pace", 72),

    p("MS Dhoni", "CSK", 2011, "Wicketkeeper Captain", 88, 8, 86, 99, false, true, "S", "none", 90),
    p("Suresh Raina", "CSK", 2011, "Top Order", 89, 42, 88, 78, false, false, "S", "spin", 88),
    p("Michael Hussey", "CSK", 2011, "Opener", 86, 4, 78, 72, true, false, "A", "none", 83),
    p("Murali Vijay", "CSK", 2011, "Opener", 82, 8, 76, 62, false, false, "A", "none", 79),
    p("Albie Morkel", "CSK", 2011, "Pace All-rounder", 76, 80, 76, 66, true, false, "A", "pace", 78),
    p("Ravichandran Ashwin", "CSK", 2011, "Off Spinner", 54, 86, 76, 74, false, false, "A", "spin", 82),
    p("Subramaniam Badrinath", "CSK", 2011, "Anchor", 77, 10, 76, 62, false, false, "B", "none", 74),
    p("Doug Bollinger", "CSK", 2011, "Left Arm Pace", 14, 82, 72, 54, true, false, "B", "pace", 76),

    p("MS Dhoni", "CSK", 2018, "Wicketkeeper Captain", 87, 8, 83, 99, false, true, "S", "none", 88),
    p("Shane Watson", "CSK", 2018, "Pace All-rounder", 86, 74, 78, 78, true, false, "S", "pace", 86),
    p("Ambati Rayudu", "CSK", 2018, "Top Order", 84, 10, 75, 64, false, false, "A", "none", 82),
    p("Dwayne Bravo", "CSK", 2018, "Death All-rounder", 74, 86, 84, 78, true, false, "A", "pace", 83),
    p("Ravindra Jadeja", "CSK", 2018, "Spin All-rounder", 78, 86, 96, 82, false, false, "S", "spin", 87),
    p("Deepak Chahar", "CSK", 2018, "Swing Bowler", 34, 82, 75, 58, false, false, "B", "pace", 77),
    p("Faf du Plessis", "CSK", 2018, "Opener", 85, 8, 88, 78, true, false, "A", "none", 84),
    p("Imran Tahir", "CSK", 2018, "Leg Spinner", 12, 86, 73, 62, true, false, "A", "spin", 82),
    p("Shardul Thakur", "CSK", 2018, "Pace Bowler", 44, 78, 74, 62, false, false, "B", "pace", 75),

    p("Ruturaj Gaikwad", "CSK", 2021, "Opener", 86, 6, 80, 82, false, false, "A", "none", 86),
    p("Moeen Ali", "CSK", 2021, "Spin All-rounder", 82, 78, 80, 66, true, false, "A", "spin", 82),
    p("Josh Hazlewood", "CSK", 2021, "Pace Bowler", 14, 84, 74, 58, true, false, "A", "pace", 81),
    p("Sam Curran", "CSK", 2021, "Pace All-rounder", 70, 82, 79, 62, true, false, "A", "pace", 79),
    p("Devon Conway", "CSK", 2023, "Wicketkeeper Opener", 84, 6, 78, 68, true, true, "A", "none", 84),
    p("Ajinkya Rahane", "CSK", 2023, "Top Order", 79, 8, 78, 70, false, false, "B", "none", 78),
    p("Shivam Dube", "CSK", 2023, "Power Hitter", 82, 42, 70, 58, false, false, "A", "pace", 81),
    p("Matheesha Pathirana", "CSK", 2023, "Death Bowler", 10, 84, 70, 52, true, false, "A", "pace", 80),
    p("Maheesh Theekshana", "CSK", 2023, "Mystery Spinner", 18, 82, 74, 56, true, false, "B", "spin", 76),

    p("Chris Gayle", "RCB", 2011, "Opener", 94, 38, 70, 74, true, false, "S", "spin", 92),
    p("Virat Kohli", "RCB", 2011, "Top Order", 86, 18, 88, 90, false, false, "S", "none", 86),
    p("AB de Villiers", "RCB", 2011, "360 Batter", 93, 10, 92, 76, true, false, "S", "none", 90),
    p("Tillakaratne Dilshan", "RCB", 2011, "Opener", 82, 48, 82, 72, true, false, "A", "spin", 79),
    p("Zaheer Khan", "RCB", 2011, "Swing Bowler", 16, 84, 72, 74, false, false, "A", "pace", 79),
    p("Daniel Vettori", "RCB", 2011, "Spin Captain", 48, 82, 78, 82, true, false, "A", "spin", 77),
    p("Mayank Agarwal", "RCB", 2011, "Top Order", 76, 8, 74, 58, false, false, "B", "none", 73),
    p("Sreenath Aravind", "RCB", 2011, "Left Arm Pace", 10, 76, 68, 52, false, false, "C", "pace", 71),

    p("Virat Kohli", "RCB", 2016, "Run Machine", 98, 18, 90, 92, false, false, "S", "none", 97),
    p("Chris Gayle", "RCB", 2016, "Power Opener", 90, 34, 68, 72, true, false, "S", "spin", 84),
    p("AB de Villiers", "RCB", 2016, "360 Batter", 96, 10, 92, 78, true, false, "S", "none", 94),
    p("KL Rahul", "RCB", 2016, "Wicketkeeper Batter", 86, 8, 80, 74, false, true, "A", "none", 85),
    p("Shane Watson", "RCB", 2016, "Pace All-rounder", 80, 82, 78, 76, true, false, "A", "pace", 80),
    p("Yuzvendra Chahal", "RCB", 2016, "Leg Spinner", 18, 88, 72, 62, false, false, "A", "spin", 84),
    p("Stuart Binny", "RCB", 2016, "Seam All-rounder", 68, 70, 74, 60, false, false, "B", "pace", 70),
    p("Sachin Baby", "RCB", 2016, "Middle Order", 70, 26, 72, 54, false, false, "C", "spin", 68),

    p("Faf du Plessis", "RCB", 2024, "Opener Captain", 84, 6, 86, 82, true, false, "A", "none", 80),
    p("Rajat Patidar", "RCB", 2024, "Middle Order", 82, 8, 75, 58, false, false, "A", "none", 81),
    p("Glenn Maxwell", "RCB", 2024, "Spin All-rounder", 84, 76, 86, 76, true, false, "S", "spin", 82),
    p("Dinesh Karthik", "RCB", 2024, "Wicketkeeper Finisher", 80, 8, 78, 76, false, true, "A", "none", 82),
    p("Mohammed Siraj", "RCB", 2024, "Pace Bowler", 16, 82, 76, 64, false, false, "A", "pace", 78),
    p("Will Jacks", "RCB", 2024, "Batting All-rounder", 80, 64, 76, 58, true, false, "B", "spin", 76),
    p("Yash Dayal", "RCB", 2024, "Left Arm Pace", 12, 76, 70, 54, false, false, "C", "pace", 72),

    p("Gautam Gambhir", "KKR", 2012, "Opener Captain", 86, 8, 82, 94, false, false, "S", "none", 86),
    p("Jacques Kallis", "KKR", 2012, "Pace All-rounder", 84, 82, 82, 80, true, false, "S", "pace", 84),
    p("Sunil Narine", "KKR", 2012, "Mystery Spinner", 50, 94, 82, 74, true, false, "S", "spin", 89),
    p("Yusuf Pathan", "KKR", 2012, "Power All-rounder", 78, 70, 74, 66, false, false, "A", "spin", 78),
    p("Manvinder Bisla", "KKR", 2012, "Wicketkeeper Batter", 74, 6, 72, 56, false, true, "B", "none", 72),
    p("Manoj Tiwary", "KKR", 2012, "Middle Order", 76, 30, 78, 62, false, false, "B", "spin", 73),
    p("Brett Lee", "KKR", 2012, "Pace Bowler", 28, 82, 74, 70, true, false, "B", "pace", 76),
    p("Shakib Al Hasan", "KKR", 2012, "Spin All-rounder", 80, 84, 82, 78, true, false, "S", "spin", 84),

    p("Robin Uthappa", "KKR", 2014, "Wicketkeeper Opener", 87, 8, 78, 68, false, true, "A", "none", 86),
    p("Andre Russell", "KKR", 2014, "Pace All-rounder", 86, 86, 86, 76, true, false, "S", "pace", 88),
    p("Morne Morkel", "KKR", 2014, "Pace Bowler", 12, 84, 72, 58, true, false, "A", "pace", 79),
    p("Piyush Chawla", "KKR", 2014, "Leg Spinner", 40, 78, 70, 60, false, false, "B", "spin", 75),
    p("Manish Pandey", "KKR", 2014, "Top Order", 82, 8, 80, 62, false, false, "A", "none", 80),
    p("Umesh Yadav", "KKR", 2014, "Pace Bowler", 14, 80, 74, 58, false, false, "B", "pace", 74),

    p("Phil Salt", "KKR", 2024, "Wicketkeeper Opener", 84, 6, 80, 62, true, true, "A", "none", 83),
    p("Venkatesh Iyer", "KKR", 2024, "Batting All-rounder", 82, 66, 78, 62, false, false, "A", "pace", 80),
    p("Shreyas Iyer", "KKR", 2024, "Middle Order Captain", 84, 8, 78, 84, false, false, "A", "none", 82),
    p("Rinku Singh", "KKR", 2024, "Finisher", 84, 8, 82, 60, false, false, "A", "none", 83),
    p("Varun Chakravarthy", "KKR", 2024, "Mystery Spinner", 12, 86, 70, 54, false, false, "A", "spin", 82),
    p("Mitchell Starc", "KKR", 2024, "Left Arm Pace", 20, 87, 74, 64, true, false, "A", "pace", 81),
    p("Harshit Rana", "KKR", 2024, "Pace Bowler", 18, 78, 72, 56, false, false, "B", "pace", 75),
    p("Ramandeep Singh", "KKR", 2024, "Utility Hitter", 74, 54, 80, 54, false, false, "B", "pace", 72),

    p("David Warner", "SRH", 2016, "Opener Captain", 94, 8, 84, 92, true, false, "S", "none", 93),
    p("Shikhar Dhawan", "SRH", 2016, "Opener", 86, 8, 78, 76, false, false, "A", "none", 84),
    p("Yuvraj Singh", "SRH", 2016, "Batting All-rounder", 80, 66, 78, 74, false, false, "A", "spin", 78),
    p("Moises Henriques", "SRH", 2016, "Pace All-rounder", 78, 76, 76, 68, true, false, "A", "pace", 77),
    p("Naman Ojha", "SRH", 2016, "Wicketkeeper", 72, 6, 74, 58, false, true, "B", "none", 70),
    p("Bhuvneshwar Kumar", "SRH", 2016, "Swing Bowler", 30, 90, 78, 72, false, false, "A", "pace", 87),
    p("Mustafizur Rahman", "SRH", 2016, "Cutter Specialist", 10, 86, 70, 54, true, false, "A", "pace", 82),
    p("Ben Cutting", "SRH", 2016, "Pace All-rounder", 70, 76, 74, 60, true, false, "B", "pace", 75),

    p("Kane Williamson", "SRH", 2018, "Anchor Captain", 89, 6, 84, 90, true, false, "S", "none", 88),
    p("Rashid Khan", "SRH", 2018, "Leg Spinner", 58, 94, 86, 76, true, false, "S", "spin", 91),
    p("Siddarth Kaul", "SRH", 2018, "Death Bowler", 10, 80, 70, 54, false, false, "B", "pace", 76),
    p("Wriddhiman Saha", "SRH", 2018, "Wicketkeeper Opener", 76, 6, 84, 64, false, true, "B", "none", 74),
    p("Carlos Brathwaite", "SRH", 2018, "Pace All-rounder", 72, 74, 75, 62, true, false, "B", "pace", 72),

    p("Travis Head", "SRH", 2024, "Explosive Opener", 92, 34, 78, 70, true, false, "S", "spin", 90),
    p("Abhishek Sharma", "SRH", 2024, "Spin All-rounder", 86, 70, 78, 62, false, false, "A", "spin", 85),
    p("Heinrich Klaasen", "SRH", 2024, "Wicketkeeper Finisher", 91, 6, 80, 70, true, true, "S", "none", 89),
    p("Aiden Markram", "SRH", 2024, "Batting All-rounder", 80, 58, 84, 78, true, false, "A", "spin", 76),
    p("Nitish Kumar Reddy", "SRH", 2024, "Pace All-rounder", 78, 70, 78, 56, false, false, "A", "pace", 79),
    p("Pat Cummins", "SRH", 2024, "Pace Captain", 58, 88, 82, 86, true, false, "S", "pace", 84),
    p("T Natarajan", "SRH", 2024, "Yorker Bowler", 12, 82, 70, 54, false, false, "B", "pace", 78),
    p("Shahbaz Ahmed", "SRH", 2024, "Spin All-rounder", 68, 72, 76, 58, false, false, "B", "spin", 72),

    p("Shane Watson", "RR", 2008, "Pace All-rounder", 88, 84, 84, 78, true, false, "S", "pace", 89),
    p("Graeme Smith", "RR", 2008, "Opener", 82, 6, 78, 86, true, false, "A", "none", 80),
    p("Sohail Tanvir", "RR", 2008, "Left Arm Pace", 28, 90, 72, 58, true, false, "A", "pace", 86),
    p("Shane Warne", "RR", 2008, "Leg Spin Captain", 46, 88, 76, 96, true, false, "S", "spin", 85),
    p("Kamran Akmal", "RR", 2008, "Wicketkeeper Opener", 78, 6, 72, 58, true, true, "B", "none", 74),
    p("Swapnil Asnodkar", "RR", 2008, "Opener", 76, 8, 72, 54, false, false, "B", "none", 73),
    p("Munaf Patel", "RR", 2008, "Pace Bowler", 12, 78, 70, 58, false, false, "B", "pace", 73),

    p("Jos Buttler", "RR", 2022, "Wicketkeeper Opener", 95, 6, 82, 78, true, true, "S", "none", 94),
    p("Sanju Samson", "RR", 2022, "Wicketkeeper Captain", 86, 6, 80, 84, false, true, "A", "none", 84),
    p("Yashasvi Jaiswal", "RR", 2022, "Opener", 84, 18, 78, 60, false, false, "A", "spin", 81),
    p("Shimron Hetmyer", "RR", 2022, "Finisher", 82, 8, 76, 58, true, false, "A", "none", 79),
    p("Ravichandran Ashwin", "RR", 2022, "Off Spin All-rounder", 66, 84, 76, 78, false, false, "A", "spin", 80),
    p("Yuzvendra Chahal", "RR", 2022, "Leg Spinner", 16, 90, 70, 62, false, false, "A", "spin", 87),
    p("Trent Boult", "RR", 2022, "Swing Bowler", 18, 88, 76, 64, true, false, "A", "pace", 84),
    p("Prasidh Krishna", "RR", 2022, "Pace Bowler", 10, 80, 72, 54, false, false, "B", "pace", 75),
    p("Riyan Parag", "RR", 2022, "Batting All-rounder", 76, 58, 80, 58, false, false, "B", "spin", 75),

    p("Glenn Maxwell", "PBKS", 2014, "Power All-rounder", 91, 72, 84, 72, true, false, "S", "spin", 91),
    p("David Miller", "PBKS", 2014, "Finisher", 87, 6, 78, 66, true, false, "A", "none", 85),
    p("Virender Sehwag", "PBKS", 2014, "Opener", 86, 28, 70, 78, false, false, "A", "spin", 80),
    p("Wriddhiman Saha", "PBKS", 2014, "Wicketkeeper Opener", 80, 6, 86, 62, false, true, "A", "none", 79),
    p("George Bailey", "PBKS", 2014, "Middle Order Captain", 78, 6, 78, 84, true, false, "B", "none", 76),
    p("Axar Patel", "PBKS", 2014, "Spin All-rounder", 66, 82, 82, 68, false, false, "A", "spin", 78),
    p("Sandeep Sharma", "PBKS", 2014, "Swing Bowler", 12, 80, 70, 54, false, false, "B", "pace", 76),
    p("Rishi Dhawan", "PBKS", 2014, "Pace All-rounder", 64, 72, 74, 58, false, false, "B", "pace", 70),

    p("Shikhar Dhawan", "PBKS", 2023, "Opener Captain", 84, 8, 76, 82, false, false, "A", "none", 80),
    p("Prabhsimran Singh", "PBKS", 2023, "Wicketkeeper Opener", 78, 6, 74, 54, false, true, "B", "none", 75),
    p("Liam Livingstone", "PBKS", 2023, "Spin All-rounder", 84, 70, 82, 66, true, false, "A", "spin", 80),
    p("Sam Curran", "PBKS", 2023, "Pace All-rounder", 76, 82, 80, 68, true, false, "A", "pace", 80),
    p("Arshdeep Singh", "PBKS", 2023, "Left Arm Pace", 12, 84, 70, 58, false, false, "A", "pace", 80),
    p("Kagiso Rabada", "PBKS", 2023, "Strike Bowler", 16, 88, 76, 64, true, false, "A", "pace", 83),
    p("Jitesh Sharma", "PBKS", 2023, "Wicketkeeper Finisher", 79, 6, 78, 58, false, true, "B", "none", 76),
    p("Harpreet Brar", "PBKS", 2023, "Spin All-rounder", 58, 76, 76, 54, false, false, "B", "spin", 72),

    p("Shreyas Iyer", "DC", 2019, "Middle Order Captain", 84, 8, 78, 84, false, false, "A", "none", 82),
    p("Rishabh Pant", "DC", 2019, "Wicketkeeper Batter", 90, 6, 78, 82, false, true, "S", "none", 88),
    p("Prithvi Shaw", "DC", 2019, "Opener", 82, 8, 74, 58, false, false, "A", "none", 79),
    p("Kagiso Rabada", "DC", 2019, "Strike Bowler", 16, 92, 76, 66, true, false, "S", "pace", 88),
    p("Axar Patel", "DC", 2019, "Spin All-rounder", 68, 82, 84, 70, false, false, "A", "spin", 79),
    p("Amit Mishra", "DC", 2019, "Leg Spinner", 28, 82, 68, 68, false, false, "B", "spin", 77),
    p("Chris Morris", "DC", 2019, "Pace All-rounder", 72, 82, 78, 62, true, false, "A", "pace", 78),
    p("Ishant Sharma", "DC", 2019, "Pace Bowler", 10, 78, 72, 62, false, false, "B", "pace", 74),

    p("Marcus Stoinis", "DC", 2021, "Pace All-rounder", 80, 76, 78, 64, true, false, "A", "pace", 78),
    p("Anrich Nortje", "DC", 2021, "Express Pace", 10, 86, 74, 54, true, false, "A", "pace", 82),
    p("Avesh Khan", "DC", 2021, "Pace Bowler", 12, 82, 70, 54, false, false, "A", "pace", 79),
    p("Shimron Hetmyer", "DC", 2021, "Finisher", 82, 8, 76, 58, true, false, "A", "none", 80),
    p("Ravichandran Ashwin", "DC", 2021, "Off Spinner", 58, 82, 76, 78, false, false, "A", "spin", 78),

    p("Hardik Pandya", "GT", 2022, "Captain All-rounder", 86, 78, 84, 90, false, false, "S", "pace", 88),
    p("Shubman Gill", "GT", 2022, "Opener", 86, 8, 82, 76, false, false, "A", "none", 84),
    p("Rashid Khan", "GT", 2022, "Leg Spin All-rounder", 70, 94, 88, 80, true, false, "S", "spin", 91),
    p("David Miller", "GT", 2022, "Finisher", 86, 6, 80, 66, true, false, "A", "none", 84),
    p("Rahul Tewatia", "GT", 2022, "Finishing All-rounder", 78, 70, 78, 60, false, false, "B", "spin", 78),
    p("Mohammed Shami", "GT", 2022, "Powerplay Bowler", 14, 88, 72, 70, false, false, "A", "pace", 85),
    p("Lockie Ferguson", "GT", 2022, "Express Pace", 14, 84, 74, 54, true, false, "A", "pace", 79),
    p("Wriddhiman Saha", "GT", 2022, "Wicketkeeper Opener", 78, 6, 86, 64, false, true, "B", "none", 76),
    p("R Sai Kishore", "GT", 2022, "Left Arm Spinner", 26, 78, 72, 54, false, false, "B", "spin", 73),

    p("Shubman Gill", "GT", 2023, "Orange Cap Opener", 96, 8, 84, 84, false, false, "S", "none", 95),
    p("Sai Sudharsan", "GT", 2023, "Top Order", 80, 12, 76, 56, false, false, "B", "none", 79),
    p("Noor Ahmad", "GT", 2023, "Wrist Spinner", 16, 80, 70, 50, true, false, "B", "spin", 76),
    p("Mohit Sharma", "GT", 2023, "Death Bowler", 16, 84, 70, 58, false, false, "A", "pace", 82),
    p("Vijay Shankar", "GT", 2023, "Batting All-rounder", 76, 58, 74, 58, false, false, "B", "pace", 74),

    p("KL Rahul", "LSG", 2022, "Wicketkeeper Opener", 86, 6, 80, 84, false, true, "A", "none", 84),
    p("Quinton de Kock", "LSG", 2022, "Wicketkeeper Opener", 86, 6, 80, 66, true, true, "A", "none", 83),
    p("Deepak Hooda", "LSG", 2022, "Batting All-rounder", 78, 62, 76, 58, false, false, "B", "spin", 75),
    p("Marcus Stoinis", "LSG", 2022, "Pace All-rounder", 82, 76, 78, 66, true, false, "A", "pace", 79),
    p("Krunal Pandya", "LSG", 2022, "Spin All-rounder", 72, 78, 82, 72, false, false, "B", "spin", 76),
    p("Jason Holder", "LSG", 2022, "Pace All-rounder", 68, 82, 80, 74, true, false, "A", "pace", 78),
    p("Ravi Bishnoi", "LSG", 2022, "Leg Spinner", 12, 82, 74, 54, false, false, "A", "spin", 78),
    p("Avesh Khan", "LSG", 2022, "Pace Bowler", 12, 80, 70, 54, false, false, "B", "pace", 75),
    p("Mohsin Khan", "LSG", 2022, "Left Arm Pace", 12, 78, 70, 52, false, false, "B", "pace", 74),

    p("Kyle Mayers", "LSG", 2023, "Pace All-rounder", 80, 70, 76, 58, true, false, "B", "pace", 77),
    p("Nicholas Pooran", "LSG", 2023, "Wicketkeeper Finisher", 88, 6, 80, 70, true, true, "S", "none", 86),
    p("Mark Wood", "LSG", 2023, "Express Pace", 10, 86, 72, 54, true, false, "A", "pace", 80),
    p("Naveen-ul-Haq", "LSG", 2023, "Cutter Bowler", 10, 78, 70, 52, true, false, "B", "pace", 74),
    p("Ayush Badoni", "LSG", 2023, "Middle Order", 74, 22, 74, 52, false, false, "B", "spin", 72),
    p("Amit Mishra", "LSG", 2023, "Leg Spinner", 26, 78, 68, 68, false, false, "B", "spin", 72)
  ];

  var chemistryPairs = [
    { a: "MS Dhoni", b: "Ravindra Jadeja", label: "Dhoni + Jadeja", bonus: 5 },
    { a: "MS Dhoni", b: "Suresh Raina", label: "Dhoni + Raina", bonus: 5 },
    { a: "Virat Kohli", b: "AB de Villiers", label: "Kohli + AB", bonus: 6 },
    { a: "Rohit Sharma", b: "Jasprit Bumrah", label: "Rohit + Bumrah", bonus: 5 },
    { a: "Sunil Narine", b: "Andre Russell", label: "Narine + Russell", bonus: 6 },
    { a: "David Warner", b: "Shikhar Dhawan", label: "Warner + Dhawan", bonus: 4 },
    { a: "Rashid Khan", b: "Hardik Pandya", label: "Rashid + Hardik", bonus: 4 },
    { a: "Jos Buttler", b: "Sanju Samson", label: "Buttler + Samson", bonus: 4 },
    { a: "Shubman Gill", b: "Mohammed Shami", label: "Gill + Shami", bonus: 4 },
    { a: "KL Rahul", b: "Quinton de Kock", label: "Rahul + de Kock", bonus: 4 },
    { a: "Ruturaj Gaikwad", b: "Devon Conway", label: "Ruturaj + Conway", bonus: 4 },
    { a: "Glenn Maxwell", b: "David Miller", label: "Maxwell + Miller", bonus: 3 }
  ];

  var opponents = [
    {
      code: "MI",
      name: "Mumbai Indians",
      captain: "Hardik Pandya",
      homeGround: "Wankhede Stadium",
      playingXI: ["Rohit Sharma", "Ryan Rickelton", "Suryakumar Yadav", "Tilak Varma", "Hardik Pandya", "Naman Dhir", "Will Jacks", "Mitchell Santner", "Deepak Chahar", "Trent Boult", "Jasprit Bumrah"],
      ratings: { batting: 89, bowling: 88, fielding: 84, leadership: 84, form: 83 },
      strengthProfile: ["Top order shot range", "Death bowling", "Wankhede tempo"]
    },
    {
      code: "CSK",
      name: "Chennai Super Kings",
      captain: "Ruturaj Gaikwad",
      homeGround: "M. A. Chidambaram Stadium",
      playingXI: ["Ruturaj Gaikwad", "Devon Conway", "Rahul Tripathi", "Shivam Dube", "Ravindra Jadeja", "MS Dhoni", "Ravichandran Ashwin", "Noor Ahmad", "Matheesha Pathirana", "Khaleel Ahmed", "Anshul Kamboj"],
      ratings: { batting: 84, bowling: 86, fielding: 82, leadership: 89, form: 82 },
      strengthProfile: ["Spin control", "Finishing IQ", "Chepauk squeeze"]
    },
    {
      code: "RCB",
      name: "Royal Challengers Bengaluru",
      captain: "Rajat Patidar",
      homeGround: "M. Chinnaswamy Stadium",
      playingXI: ["Virat Kohli", "Phil Salt", "Rajat Patidar", "Liam Livingstone", "Jitesh Sharma", "Krunal Pandya", "Tim David", "Bhuvneshwar Kumar", "Josh Hazlewood", "Yash Dayal", "Suyash Sharma"],
      ratings: { batting: 88, bowling: 82, fielding: 81, leadership: 80, form: 86 },
      strengthProfile: ["Chinnaswamy batting", "Powerplay experience", "Middle overs risk"]
    },
    {
      code: "KKR",
      name: "Kolkata Knight Riders",
      captain: "Ajinkya Rahane",
      homeGround: "Eden Gardens",
      playingXI: ["Sunil Narine", "Quinton de Kock", "Venkatesh Iyer", "Ajinkya Rahane", "Rinku Singh", "Andre Russell", "Ramandeep Singh", "Varun Chakravarthy", "Anrich Nortje", "Harshit Rana", "Vaibhav Arora"],
      ratings: { batting: 86, bowling: 85, fielding: 83, leadership: 82, form: 81 },
      strengthProfile: ["Mystery spin", "Explosive all-rounders", "Eden pressure"]
    },
    {
      code: "SRH",
      name: "Sunrisers Hyderabad",
      captain: "Pat Cummins",
      homeGround: "Rajiv Gandhi International Stadium",
      playingXI: ["Travis Head", "Abhishek Sharma", "Ishan Kishan", "Heinrich Klaasen", "Nitish Kumar Reddy", "Abhinav Manohar", "Pat Cummins", "Harshal Patel", "Rahul Chahar", "Mohammed Shami", "Adam Zampa"],
      ratings: { batting: 91, bowling: 83, fielding: 82, leadership: 86, form: 85 },
      strengthProfile: ["Powerplay violence", "Pace leadership", "High-scoring chases"]
    },
    {
      code: "RR",
      name: "Rajasthan Royals",
      captain: "Sanju Samson",
      homeGround: "Sawai Mansingh Stadium",
      playingXI: ["Yashasvi Jaiswal", "Sanju Samson", "Nitish Rana", "Riyan Parag", "Shimron Hetmyer", "Dhruv Jurel", "Wanindu Hasaranga", "Jofra Archer", "Maheesh Theekshana", "Tushar Deshpande", "Sandeep Sharma"],
      ratings: { batting: 84, bowling: 84, fielding: 82, leadership: 82, form: 80 },
      strengthProfile: ["Left-right batting", "Spin matchups", "Death overs volatility"]
    },
    {
      code: "PBKS",
      name: "Punjab Kings",
      captain: "Shreyas Iyer",
      homeGround: "PCA New Stadium",
      playingXI: ["Prabhsimran Singh", "Priyansh Arya", "Shreyas Iyer", "Nehal Wadhera", "Glenn Maxwell", "Marcus Stoinis", "Shashank Singh", "Marco Jansen", "Arshdeep Singh", "Yuzvendra Chahal", "Lockie Ferguson"],
      ratings: { batting: 85, bowling: 84, fielding: 80, leadership: 84, form: 83 },
      strengthProfile: ["Middle-order depth", "Left-arm pace", "Leg-spin control"]
    },
    {
      code: "DC",
      name: "Delhi Capitals",
      captain: "Axar Patel",
      homeGround: "Arun Jaitley Stadium",
      playingXI: ["Faf du Plessis", "Jake Fraser-McGurk", "KL Rahul", "Harry Brook", "Tristan Stubbs", "Axar Patel", "Ashutosh Sharma", "Mitchell Starc", "Kuldeep Yadav", "T Natarajan", "Mukesh Kumar"],
      ratings: { batting: 86, bowling: 86, fielding: 82, leadership: 83, form: 82 },
      strengthProfile: ["Wrist spin", "Left-arm pace", "Flexible batting order"]
    },
    {
      code: "GT",
      name: "Gujarat Titans",
      captain: "Shubman Gill",
      homeGround: "Narendra Modi Stadium",
      playingXI: ["Shubman Gill", "Sai Sudharsan", "Jos Buttler", "Shahrukh Khan", "Rahul Tewatia", "Washington Sundar", "Rashid Khan", "Kagiso Rabada", "Mohammed Siraj", "Prasidh Krishna", "Sai Kishore"],
      ratings: { batting: 87, bowling: 87, fielding: 83, leadership: 84, form: 84 },
      strengthProfile: ["Top-three quality", "Spin choke", "Ahmedabad scale"]
    },
    {
      code: "LSG",
      name: "Lucknow Super Giants",
      captain: "Rishabh Pant",
      homeGround: "Ekana Cricket Stadium",
      playingXI: ["Aiden Markram", "Mitchell Marsh", "Rishabh Pant", "Nicholas Pooran", "Ayush Badoni", "David Miller", "Abdul Samad", "Ravi Bishnoi", "Mohsin Khan", "Mayank Yadav", "Avesh Khan"],
      ratings: { batting: 86, bowling: 82, fielding: 80, leadership: 82, form: 81 },
      strengthProfile: ["Left-handed power", "Ekana variation", "Express pace upside"]
    }
  ];

  var pitches = [
    { type: "Batting Paradise", batting: 7, bowling: -5, spin: -2, pace: -3, score: 20, pressure: 1 },
    { type: "Balanced", batting: 1, bowling: 1, spin: 0, pace: 0, score: 0, pressure: 0 },
    { type: "Slow Turner", batting: -4, bowling: 4, spin: 8, pace: -4, score: -12, pressure: 2 },
    { type: "Dust Bowl", batting: -8, bowling: 6, spin: 12, pace: -6, score: -18, pressure: 4 },
    { type: "Pace Friendly", batting: -3, bowling: 6, spin: -3, pace: 8, score: -6, pressure: 2 },
    { type: "Swing Friendly", batting: -5, bowling: 7, spin: -2, pace: 7, score: -10, pressure: 3 },
    { type: "High Scoring", batting: 5, bowling: -3, spin: -1, pace: -2, score: 15, pressure: 1 },
    { type: "Low Scoring", batting: -7, bowling: 7, spin: 4, pace: 4, score: -20, pressure: 4 }
  ];

  var modes = [
    { id: "classic", label: "Classic", description: "Full ratings, pure pursuit of 14-0." },
    { id: "realist", label: "Realist", description: "Full ratings with a hard four-overseas-player cap." },
    { id: "knowledge", label: "Knowledge", description: "Ratings are hidden during the draft; IPL memory matters." }
  ];

  window.IPL_DATA = {
    teams: teams,
    players: players,
    chemistryPairs: chemistryPairs,
    opponents: opponents,
    pitches: pitches,
    modes: modes
  };
})();
