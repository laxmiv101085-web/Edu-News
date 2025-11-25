-- Clean up non-educational articles
-- Run this SQL query in your database to remove non-educational content

DELETE FROM articles 
WHERE LOWER(title || ' ' || COALESCE(content, '') || ' ' || COALESCE(summary, '')) 
NOT SIMILAR TO '%(exam|test|jee|neet|upsc|gate|cat|gmat|sat|scholarship|fellowship|student|admission|university|college|school|education|cbse|icse|board|result|score|rank|syllabus|curriculum|degree|course|class|teacher|learning|iit|nit|aiims|hostel|campus|academic|ugc|aicte|naac|coaching|tuition)%';
