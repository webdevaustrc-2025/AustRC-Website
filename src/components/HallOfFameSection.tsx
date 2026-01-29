import { motion } from "motion/react";
import { Quote, Award, Facebook, Linkedin, Mail } from "lucide-react";

const allHallOfFameMembers = [
  {
    name: "Monjure Mowla",
    position: "Former VP, AUSTRC",
    year: "Embedded Software Engineer (Level - 3), Neural Semiconductor Limited",
    image: "https://lh3.googleusercontent.com/sitesv/APaQ0SRpTvmIazz_BG4eII6e4hUVzQcRo41gG3qt8WBjvf5PiCi1C5XBhJHVna8pl277RSKtDDeKRFsPqdLR_4h52Z_4bY6HJv_NIXTyG9dpbPCKoZ4XE2Au9bWZo963B6ybmOtkodj7Yl_qE20q4TEQHGFC9Fhs_31IfxXgqXXDrDsibFHXysdJ0m0d2ao=w1280",
    quote: "As the founding Vice President of the AUST Robotics Club, I had the opportunity to help lead the club's activities for a year. During this time, I worked alongside an amazing team to organize various events, including a national-level competition that brought together passionate minds. It was a rewarding experience, and I'm grateful to have contributed to promoting robotics within our university.",
    facebook: "https://www.facebook.com/monjur.e.mowla.abir/",
    linkedin: "www.linkedin.com%2Fin%2Fmonjure-mowla&sa=D&sntz=1&usg=AOvVaw3SZ24okDdJuMsKSc3E5eTR",
    email: "monjure.mowlaabir273@gmail.com",
  },
  {
    name: "Farhat Nahian",
    position: "Former VP, AUSTRC",
    year: "System Engineer, Huawei Technologies (Bangladesh) ltd",
    image: "https://lh3.googleusercontent.com/sitesv/APaQ0SSk-os7ZPSOMOudTILkWoZmuE_mt5Mv2Z1TGL-N7oYptdqblZTyLGSLtwc9CjMkelv9FRydFaygREDk5jGFw98aYQcaoQngQcWtpRC-utgj2DtIhMqDxhi5ZEoGae42COvjyJiyToRxAZjBkxW1lcmfzqd3I-nlCjTGY4dQXKMHFYaooDtqEUCPy1U=w1280",
    quote: "Started this journey as a sub-executive member of the founding panel of the AUST Robotics Club, I was fortunate enough to have ended my journey as one of the leaders of the club. The more my responsibilities grew, the more my skills grew and looking back, I realize that it's the experience and learning that shaped the person I am today. I'm genuinely grateful for the love, respect, and platform the club has offered me. Lastly- no matter your starting point, regardless of your skill level or experience, get involved with dedication and self-belief, you will eventually grow into the person you're meant to be.",
    facebook: "https://www.google.com/url?q=https%3A%2F%2Fwww.facebook.com%2Fnahian.islam.79230&sa=D&sntz=1&usg=AOvVaw3HCBFNXyNUrZ-OsFt16Q-m",
    linkedin: "https://www.google.com/url?q=https%3A%2F%2Fwww.linkedin.com%2Fin%2Ffarhatnahian%2F&sa=D&sntz=1&usg=AOvVaw0CzOPNgTYqqLybAWx4HS54",
    email: "nahianfarhat@gmail.com",
  },
  {
    name: "Abdul Quader",
    position: "Former VP, AUSTRC",
    year: "Graduate Trainee Engineer - Atlas Copco Bangladesh Ltd.",
    image: "https://lh3.googleusercontent.com/sitesv/APaQ0SQUabhbNV1NaeFRyhVSAYvgiHZi_8I0PNJkZyPLwP__KUVgpaeK85LwjVxQoyHAP-LrVeUYLQq8ZrVfMUAqiYwyma9aoKy1k_ASrBsvyPN6Y0WtwN5YZLLOWjSUBAPJz6vHeZkZIWlck8AP_xfJVp2jzfpmpluGh-8cv7nKH7zkhMMU00jK_0VMPbw=w1280",
    quote: "Being a part of the AUST Robotics Club (ARC) was a dream come true. All the enthusiastic people around, creative minds doing things that never happened before. From seminar to national competitions, I have enjoyed it all and learned so many things. I will feel guilty if I do not mention the networking opportunities I had at ARC. Last but not the least, being able to work with the executives was another milestone for me and my self development. Ending my ARC journey being the Vice President was the best experience. All the best to AUSTRC for its future endeavours.",
    facebook: "https://www.google.com/url?q=https%3A%2F%2Fwww.facebook.com%2FAustRoboticsClub&sa=D&sntz=1&usg=AOvVaw2m8mUOXBJRHDnp7apbySSH",
    linkedin: "https://www.google.com/url?q=https%3A%2F%2Fwww.linkedin.com%2Fcompany%2Faust-robotics-club&sa=D&sntz=1&usg=AOvVaw1MXwho0LIiccg9dm_RuQnH",
    email: "austrc@aust.edu",
  },
  {
    name: "Md. Rahat Mahmud",
    position: "Former VP, AUSTRC",
    year: "Enterprise Relationship Manager, Axentec PLC",
    image: "https://lh3.googleusercontent.com/sitesv/APaQ0SQAzOzrN1M2-w3KNX8Na6ecOIqT3qn5t1wICtRWAnRAPuFW9pP3rb7MxNEraENfkZoIGzzcXqLCaLmW4BeVKgnx8mbbEp0KVd48S-ibW8ls6zALSXnLCh6mbiDp6gBsxFtfZHuTBdqc4ZNlv-tMVFhKnlZ3So8mER8p6b-Tij4nqIcS9_tW8zgu=w1280",
    quote: "Back to 2022, when I was in second year, second semester, I started my journey as an Executive member with AUSTRC. Following the conclusion of my time at university, I left the club in 2024, having held the position of Vice President. In this period of time, I have learned so many things about robotics. This club has given me more personal growth than just robotics knowledge. Leadership, problem-solving skills, and organizational skills are the keys in real life, which I learned from this club. I shall always have the utmost affection for this club and wish it nothing but the best, even after I become an alumni of AUSTRC. I hope new members of this club will take AUSTRC to a new height. GODSPEED.",
    facebook: "https://www.google.com/url?q=https%3A%2F%2Fwww.facebook.com%2FRahatMahmudTonmoy&sa=D&sntz=1&usg=AOvVaw0VL0NLhe_dz-5bBGINrjpF",
    linkedin: "https://www.google.com/url?q=https%3A%2F%2Fwww.linkedin.com%2Fin%2Frahatmahmudtonmoy&sa=D&sntz=1&usg=AOvVaw3XaFjrA8_0yvMbBjj5ytqg",
    email: "rahat.mahmud2017@gmail.com",
  },
  {
    name: "Anas Al Rafin",
    position: "Former GS, AUSTRC",
    year: "Co-Founder, Craftrix",
    image: "https://lh3.googleusercontent.com/sitesv/APaQ0STnm6zv7R2qBykrV8ZVraEjioQy6LHu5tpz3plxxxfj0AJaRVqB-uBSIdzvAf-AsIX4YzOLfMzptNi62RZ-hHHZgP28VV4Knf4VERpBv-Qxf0OAqSZEJcDfbFdqdVpFMiviolByTTm3HkJZYewz_D0xFD3rIkieGxmiSrtCAAxMoDWqu8XP2JKwa-U=w1280",
    quote: "I was part of the founding of the AUST Robotics Club (AUSTRC). I started as a sub-executive, then moved up to Joint Secretary, and finally became the General Secretary. One of the best experiences was organizing the first AUST Rover Challenge, where I was in charge of the Rover Competition. I worked with many seniors and juniors, and I learned a lot from them. My time with AUSTRC taught me about robotics, teamwork, and leadership. It was a great experience that helped me grow both personally and professionally.",
    facebook: "https://www.google.com/url?q=https%3A%2F%2Fwww.facebook.com%2Faa.anas.94%2F&sa=D&sntz=1&usg=AOvVaw0bEGMWQU3HeDduZXY08OpM",
    linkedin: "https://www.google.com/url?q=https%3A%2F%2Fwww.linkedin.com%2Fin%2Fanas-al-rafin-828640190&sa=D&sntz=1&usg=AOvVaw28ak8q8qxx0kczZu9B2-OJ",
    email: "anas.alrafin@gmail.com",
  },
  {
    name: "Sadia Jahan",
    position: "Former Joint Secretary, AUSTRC",
    year: "Master's in Industrial Engineering, Curtin University, Australia",
    image: "https://lh3.googleusercontent.com/sitesv/APaQ0STPfaGGQ2Q6WqzKxybC3wvIY1mJuCsL63LZt3mLXKOGktmSDC6rvdyt1jlI8zkZnb9x3-R6pyD12YLYgcHGLct5XQCfIZMF1vIfoKL4ix2ZLsvnMLmw6yiVrYXP7_DR_L3PVSyZaKnBOIbWHpK7YYYnMLBQGOz8AqrPjRHOzH2FJ2XwWEm1PXbE0RA=w1280",
    quote: "During my time as the Joint Secretary of the AUST Robotics Club (AUSTRC), I had the incredible opportunity to work closely with a team of highly motivated individuals passionate about robotics and technology. This experience not only enhanced my leadership and organizational skills but also deepened my interest in cutting-edge technology, problem-solving, and innovation. Being part of AUSTRC allowed me to contribute to the growth of the club while fostering a strong sense of community among students who share a common passion for robotics.",
    facebook: "https://www.google.com/url?q=https%3A%2F%2Fwww.facebook.com%2Fpeople%2FSadia-Jahan%2Fpfbid02Vsquct73ThtaUPB8i9h7Rd2uHithTvouKu2CUesc83qtU4CnguibF2943e3ufvHMl%2F%3Fmibextid%3DLQQJ4d&sa=D&sntz=1&usg=AOvVaw2PMCBioq__LBgfLgwqDzbB",
    linkedin: "https://www.google.com/url?q=https%3A%2F%2Fwww.linkedin.com%2Fin%2Fsadia-jahan-a03135229&sa=D&sntz=1&usg=AOvVaw2lQ_wOlAFBS9gZKHUaQssO",
    email: "sadia.jahanraisa99@gmail.com",
  },
  {
    name: "Md Saber Hossain",
    position: "Former Joint Secretary, AUSTRC",
    year: "Embedded Systems Engineer at Vertical Innovation Limited",
    image: "https://lh3.googleusercontent.com/sitesv/APaQ0SSEbWlxx9DRjfAb2JQnTDKbATZy1GuPw97lrcsNeYqnDuhCz9jrSJ7I35_z9QFdzvJAAvmOiEgsUlQ7BleNOCqOjitjvTd40ZB_tOtFOVcnfqxGoJSQjjjOTBZ11mF4tzAQfPiz-D0BbA5d-VHFr2CsMR8FhgiEHo_1FLl20x6y3XXWAWYjNluO=w1280",
    quote: "Joining the club allowed me to explore the world of robotics hands-on, surrounded by like-minded individuals passionate about innovation.",
    facebook: "https://www.google.com/url?q=https%3A%2F%2Fwww.facebook.com%2Fah.saber.58&sa=D&sntz=1&usg=AOvVaw3DkCCIPcm9y-FqQJSF00fp",
    linkedin: "https://www.google.com/url?q=https%3A%2F%2Fwww.linkedin.com%2Fin%2Fsaber-hossian-4b214a305&sa=D&sntz=1&usg=AOvVaw3jCJvhdFaKAWN6p1NDspHC",
    email: "saberhossain378@gmail.com",
  },
  {
    name: "Aishee Alam Kathey",
    position: "Former Executive Member, AUSTRC",
    year: "Studying Civil Engineering, AUST",
    image: "https://lh3.googleusercontent.com/sitesv/APaQ0SSM9NeTQllMNvfgwEO2dxTfAQDVVhVW1d3bo-CC2UpAckNWH_jP0mGgYf_iF1NHlQwcB8x8dvB4DApbaHuz_9V9vd6iU_p41OPHzYPjdjtWyAq_kfzLzw78pvq7BkcjKVDSaqzVL_RrI2jNImVT2L7_OHvArsGjT0urrqjKQHompsYxKdBnKqZJ=w1280",
    quote: "As an executive member of AUSTRC, I had the privilege of working with passionate individuals on various robotics projects and events. This role helped me enhance my leadership, teamwork, and problem-solving skills. Organizing workshops and competitions gave me valuable hands-on experience and allowed me to foster a collaborative environment for members. Overall, my time at AUSTRC was instrumental in shaping both my technical abilities and leadership growth, and I cherish the connections and lessons learned during this journey.",
    facebook: "https://www.google.com/url?q=https%3A%2F%2Fwww.facebook.com%2Faisheekathey%3Fmibextid%3DZbWKwL&sa=D&sntz=1&usg=AOvVaw3R1SpHgiigSqkKNNE2IoAe",
    linkedin: "https://www.google.com/url?q=https%3A%2F%2Fwww.linkedin.com%2Fin%2Faishee-alam-kathey-402682215&sa=D&sntz=1&usg=AOvVaw0udicsP2YkCucjAyZzuCiJ",
    email: "aishee.ce.200103198@aust.edu",
  },
  {
    name: "Ahmed Zubayer Nasif",
    position: "Former Sub Executive, AUSTRC",
    year: "Assistant Manager, BIZLI Cable, PRAN RFL Group",
    image: "https://lh3.googleusercontent.com/sitesv/APaQ0SSh1plrl3xGHScwv4Zei9zIKnJoHzEcX6MiwpwtZ4qjnQ8JU7lLukNYROFyZx6qTM2CMSOJiammPb3QdyYdTir2kFyx5L4PYYVRWVh7oPXghHJdI1E___ruDOL4CLjzSLPdXox5EFIWbFnnvcES3fY20gIO-AFpcPNEc7Z9VpxijKWdS9GXElovyO8=w1280",
    quote: "I am one of the founder member of AUST_RC. I joined as an Executive member in Graphics Design Department. I organized an international competition AUST ROVER Challenge and honoured to be a judge in Robo Soccer Competition in same event. My journey in Robotics department was not too long but I came across a lot of juniors and seniors which was a great experience that I always remember.",
    facebook: "https://www.google.com/url?q=https%3A%2F%2Fwww.facebook.com%2Fprofile.php%3Fid%3D100009556957180%26mibextid%3DZbWKwL&sa=D&sntz=1&usg=AOvVaw1bptP6YOfkoQLfkETFgGWg",
    linkedin: "https://www.google.com/url?q=https%3A%2F%2Fwww.linkedin.com%2Fin%2Fahmed-zubayer-patwary-nasif-csca%25E2%2584%25A2-281183197%2F&sa=D&sntz=1&usg=AOvVaw2s83znwd8pvB-Zpc_b1ds9",
    email: "ahmed@example.com",
  },
  {
    name: "Ariya Tahasin Prova",
    position: "Former Sub Executive, AUSTRC",
    year: "Executive - Linde Bangladesh Limited",
    image: "https://lh3.googleusercontent.com/sitesv/APaQ0SQEA4Z4DJI5x8m4f6OPrpVnCdBgTMTfxdAHFy5bW52RZnYInl0pQXSM7kHYIo8e_FLotvu77pj3plQ135tzZkRoDyi6UGmejlJpCUl9II6JbS3yB2SgKKbKdZ4ZvysH1xsAb1OHlP7yiNeRO33HWJ4m9kQnWwS4t0RYPyirueJri6HP3f_k8e5wEQQ=w1280",
    quote: "Joining AUSTRC as a Sub-executive in the first panel was a defining experience for me. Being part of a newly formed club came with its own set of challenges and responsibilities, but it also opened up a world of learning and personal growth. Collaborating closely with both students and faculty members gave me a broader perspective and allowed me to see the bigger picture in ways I hadn't before. Which is also helping me in corporate life right now. Being involved in the organisation committee in the AUST Rover Challenge 1.0 was a standout moment, as it offered the chance to work on events that aligned with my passion for hands-on experiences.",
    facebook: "https://www.google.com/url?q=https%3A%2F%2Fwww.facebook.com%2Fariya.tahasin%3Fmibextid%3DLQQJ4d&sa=D&sntz=1&usg=AOvVaw1sSIG2t4If35B9fYJ_zDuX",
    linkedin: "https://www.google.com/url?q=https%3A%2F%2Fwww.linkedin.com%2Fin%2Fariyaprova&sa=D&sntz=1&usg=AOvVaw2Q8R0nn9J67bTQwSi4tY3c",
    email: "Tahasinariya@gmail.com",
  },
  {
    name: "Fahmida Haque Mridula",
    position: "Former Sub Executive, AUSTRC",
    year: "Public Relations Officer, StepUp",
    image: "https://lh3.googleusercontent.com/sitesv/APaQ0SRDA8REDESf5JCAiW1YbZfklbrvlMERjYqFW2ckQG8fPg27qzL-kN8Ga7uJgTaif6KjmwE1ZeFLswahAdz6xMibJV8M99V7KSIpAYccG5-ch-ULb5ZMJ3PAl90qzGkS3OsMn00mxgX7Tjjgp8fs4B_gVXuYK9WlPCncOQfaDfZhp76FDBb1Mrys=w1280",
    quote: "Joining AUSTRC as a Sub-executive in very first panel was a transformative experience that shaped my personal and professional growth. Though it was a new club, everything was remarkably well-organized, providing the freedom to work in my preferred sector and building network with people from different departments. Being part of the organizing team for AUST Rover Challenge 1.0 was a standout moment, offering the opportunity to connect with professionals and students from across the country while developing my event management skills.",
    facebook: "https://www.google.com/url?q=https%3A%2F%2Fwww.facebook.com%2Fmridula.haque.16%3Fmibextid%3DZbWKwL&sa=D&sntz=1&usg=AOvVaw2ABmwfRlnpDKknCiGIZumd",
    linkedin: "https://www.google.com/url?q=https%3A%2F%2Fwww.linkedin.com%2Fin%2Fmridula-haque-091381200&sa=D&sntz=1&usg=AOvVaw0JtTZWcZc1M2FDf0hJ-1L9",
    email: "fahmidamridula16@gmail.com",
  },
  {
    name: "Dipta Chandra Dey",
    position: "Former Sub Ex, ARC & RM Judge, AUSTRC",
    year: "R & D Engineer at Walton Hi Tech PLC",
    image: "https://lh3.googleusercontent.com/sitesv/APaQ0SR9IomWa7s14I-7H1QUDOBHgMPy1o23Ug8M-U085XTw-OSAdu_vnK_QDK3sJlh5cD7yWPNY6UIz0TBHZruUbX7AWva_sj-e355hD0W_6yC14zUIy9Yla7okUOvqMWkmjafY43hnYx0CX1279BHBEC7JGNKKjNf0JMd7Xr8s73ZLTVOW8z1eO47E=w1280",
    quote: "My leadership journey began with the AUST Robotics Club by organizing the AUST Rover Challenge. This platform helped lay the foundation for my organizational leadership and communication skills. Working with this team was a wholesome experience that I will carry with me for the lifetime. My journey in the club, from being an organizer to becoming an instructor and judge in various events, will remain one of the most significant highlights of my career.",
    facebook: "https://www.google.com/url?q=https%3A%2F%2Fwww.facebook.com%2Fdipta.dey.7921%3Fmibextid%3DZbWKwL&sa=D&sntz=1&usg=AOvVaw37-KX-ye0wqGis6AyIQ6JJ",
    linkedin: "https://www.google.com/url?q=https%3A%2F%2Fwww.linkedin.com%2Fin%2Fdipta-chandra-dey-513aa6193&sa=D&sntz=1&usg=AOvVaw1sbEQ1dyelAv8Akl6SPzEG",
    email: "diptadey224@gmail.com",
  },
  {
    name: "Nuzhatul Islam Renan",
    position: "Former Sub Ex, ARC & RM Judge, AUSTRC",
    year: "Assistant Manager, Multimodal Technologies",
    image: "https://lh3.googleusercontent.com/sitesv/APaQ0SQ3PbfC29QiU1PauOML1DXQgXfgXCz1QYPV2sBCMsy9DDykiVB-RgRgDM3oks4fqE_RhiQbU49pwcFO2u00XsxwKp8uf1s9JUmhprGSmrBY7sk2au3T7RrkZ3s0qM_pZNJf0IvittulEnn5x1n6okwKiwp6ZtwI86D-l9aAIxmXeKpnS2ZpzUhd1e8=w1280",
    quote: "My experience with the AUSTRC (AUST Rover Challenge) has been an incredibly exciting and fulfilling journey. From the very beginning, I've been deeply connected to this initiative, and in 2022, I had the honor of working as a coordinator for the AUST Rover Challenge. This role allowed me to be at the heart of the action, overseeing teams and ensuring the smooth execution of the event. Each year, more and more talented individuals join the club, bringing fresh ideas and energy.",
    facebook: "https://www.google.com/url?q=https%3A%2F%2Fwww.facebook.com%2Fnuzhatulislam.renan%2F&sa=D&sntz=1&usg=AOvVaw3lTq1GFhhJJBDBsPK7Efnp",
    linkedin: "https://www.google.com/url?q=https%3A%2F%2Fwww.linkedin.com%2Fin%2Fnuzhatul-islam-renan-709075195%2F&sa=D&sntz=1&usg=AOvVaw3szqEJkX9X5weh_SEXlVM9",
    email: "nuzhatulrenan18@gmail.com",
  },
  {
    name: "Md Istiaq Jannat Nibir",
    position: "Former Sub Executive, AUSTRC",
    year: "Trainee Engineer, Ulkasemi Pvt Ltd",
    image: "https://lh3.googleusercontent.com/sitesv/APaQ0SRSoLZEseyYKPaT9hUBiaHyRpEOpcrMzqCgssklDo1n0XgYZnawEDUaGfNFGq1f2RMsdOZSJl8PlwMcSE_geAdAfopoyrkPPdjkpwkHXmia4vecg3vtOPN7adnZYSiq8BQyff69pHxah3gkDtyQ0gcB4MV1Ucjg_Evq-9XSiUK9xkKmE2Ad7wtw6tk=w1280",
    quote: "I was the Sub-Executive of the first committee of the AUST Robotic Club, where I helped organize the club's first major event, the 'AUST Rover Challenge.' This inter-university competition was a big success and a proud achievement for our team. Working with my fellow committee members, I gained valuable experience in leadership, teamwork, and event planning, which also helped me improve my understanding of robotics.",
    facebook: "https://www.google.com/url?q=https%3A%2F%2Fwww.facebook.com%2Fprofile.php%3Fid%3D100012138993693%26mibextid%3DZbWKwL&sa=D&sntz=1&usg=AOvVaw3ufYWMLTtbW9ZLMSuWeCBD",
    linkedin: "https://www.google.com/url?q=https%3A%2F%2Fwww.linkedin.com%2Fin%2Fistiaq-jannat%2F&sa=D&sntz=1&usg=AOvVaw3aXXYM9mow8d9F4jReQ2_t",
    email: "istiaqjannat03@gmail.com",
  },
  {
    name: "Mahir Wasif Hoque",
    position: "Former Co-ordinator ARC, AUSTRC",
    year: "Core System Engineer, Huawei Technologies (Bangladesh) Ltd.",
    image: "https://lh3.googleusercontent.com/sitesv/APaQ0SSNek4AlEEQwtCCLWSQuRtdaCMDdKKlZ7qFibWUJYVT1Swy5xGphQV351i59ib4WpSVggcgCEefOP5l3HON00ggtZ8k3khmHjFRmX7Q-D9if8_ye6zdDqFO3Q23L9pkHtqRWOaLvVjxHinjuWEtmlGs6KcKar6ly_0p85t9EC2iRHkyRFrngGRQ4fA=w1280",
    quote: "I joined AUST Robotics Club as a coordinator for their first ever national event. Being a part of the AUST Robotics Club gave me a platform to showcase my talents in leadership, problem-solving, and project management. As a coordinator for the AUST Rover Challenge 2022, I had the chance to take initiative, manage multiple responsibilities, and make key decisions that directly impacted the success of the event.",
    facebook: "https://www.google.com/url?q=https%3A%2F%2Fwww.facebook.com%2Fmahir.wasif.18%3Fmibextid%3DLQQJ4d&sa=D&sntz=1&usg=AOvVaw05AFU1sGHAmlPJnUC-HOHJ",
    linkedin: "https://www.google.com/url?q=https%3A%2F%2Fwww.linkedin.com%2Fin%2Fmahir-wasif-hoque%2F&sa=D&sntz=1&usg=AOvVaw2XqfNWfXNEWoWdUuBO0DuZ",
    email: "mahirwasif85@gmail.com",
  },
  {
    name: "S M Shovon",
    position: "Former Co-ordinator ARC, AUSTRC",
    year: "Masters in Electrical & Computer Engineering, University of Calgary",
    image: "https://lh3.googleusercontent.com/sitesv/APaQ0SSvCOVp6J_C_cm3SUQBjKlNopM5e4ed7pxLEVPTZjdzE4mwPg5Gqc9Kr1ttcg8a7xNG6MuIdWW-utqr9PHcBdJWSi18EMgHB_CQdL0NskRlj1i0oKvsyklNNPPmF0G5YvR2dXFpccpzr0p7bUfoAcofPDVqpFp0-7N3q6NawIaQ12_GyybTLzXU=w1280",
    quote: "I have a special place in my heart for the Aust Robotics Club because I have been a part of it since the beginning. For those who enjoy robotics and projects, this club is an outstanding place to be. At the Aust Rover Challenge, I led the Rover Challenge team and the event administration team. I got to know many brilliant people and prodigies. While working, I got to know a lot of energetic youngsters, so I am confident that this club is in good hands.",
    facebook: "https://www.google.com/url?q=https%3A%2F%2Fwww.facebook.com%2Fprofile.php%3Fid%3D100027684681891&sa=D&sntz=1&usg=AOvVaw35BqqEGmiQIduJVkp2sSRa",
    linkedin: "https://www.google.com/url?q=https%3A%2F%2Fwww.linkedin.com%2Fin%2Fs-m-shovon%2F&sa=D&sntz=1&usg=AOvVaw3iJcUZiy_ypYqLoG-ZCLJ0",
    email: "shovonsikder29@gmail.com",
  },
];

export function HallOfFameSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-black via-gray-900 to-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/3 right-1/3 w-96 h-96 bg-[#2ECC71] rounded-full blur-[150px]" />
        <div className="absolute bottom-1/3 left-1/3 w-96 h-96 bg-[#27AE60] rounded-full blur-[150px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <Award className="w-8 h-8 text-[#2ECC71]" />
            <h2 className="tracking-tight text-white text-5xl">Hall Of Fame</h2>
            <Award className="w-8 h-8 text-[#2ECC71]" />
          </div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Celebrating the visionary leaders who shaped AUSRC's legacy
          </p>
        </motion.div>

        {/* Carousels Side by Side */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {allHallOfFameMembers.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-gradient-to-br from-[rgba(46,204,113,0.1)] to-transparent border border-[rgba(46,204,113,0.3)] rounded-2xl p-6 backdrop-blur-sm shadow-[0_0_50px_0_rgba(46,204,113,0.3)] hover:shadow-[0_0_70px_0_rgba(46,204,113,0.5)] transition-all duration-300"
            >
              {/* Image */}
              <div className="relative w-32 h-32 mx-auto mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-[#2ECC71] to-[#27AE60] rounded-full blur-md opacity-50" />
                <img
                  src={member.image}
                  alt={member.name}
                  className="relative w-full h-full rounded-full object-cover border-4 border-[#2ECC71] shadow-[0_0_30px_0_rgba(46,204,113,0.6)]"
                />
              </div>

              {/* Info */}
              <div className="text-center mb-6">
                <h3 className="text-white text-2xl mb-2">
                  {member.name}
                </h3>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[rgba(46,204,113,0.2)] to-transparent border border-[rgba(46,204,113,0.3)] rounded-full mb-1">
                  <span className="text-[#2ECC71] text-sm">
                    {member.position}
                  </span>
                </div>
                <p className="text-gray-400 text-sm mt-2">
                  {member.year}
                </p>
              </div>

              {/* Quote */}
              <div className="relative mb-6">
                <Quote className="absolute -top-2 -left-2 w-8 h-8 text-[#2ECC71] opacity-30" />
                <p className="text-gray-300 text-sm leading-relaxed pl-6 pr-2 italic line-clamp-6">
                  {member.quote}
                </p>
              </div>

              {/* Social Links */}
              <div className="flex justify-center gap-3 pt-4 border-t border-[rgba(46,204,113,0.2)]">
                {member.facebook && (
                  <a
                    href={member.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-[#2ECC71]/10 hover:bg-[#2ECC71]/20 text-[#2ECC71] hover:text-white transition-all border border-[#2ECC71]/20 hover:border-[#2ECC71]/50"
                    aria-label="Facebook"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                )}
                {member.linkedin && (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-[#2ECC71]/10 hover:bg-[#2ECC71]/20 text-[#2ECC71] hover:text-white transition-all border border-[#2ECC71]/20 hover:border-[#2ECC71]/50"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className="p-2 rounded-lg bg-[#2ECC71]/10 hover:bg-[#2ECC71]/20 text-[#2ECC71] hover:text-white transition-all border border-[#2ECC71]/20 hover:border-[#2ECC71]/50"
                    aria-label="Email"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}