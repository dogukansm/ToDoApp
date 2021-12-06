namespace TodoApp.API.Models
{
    using System;
    public class Projects
    {
        public string id { get; set; }
        public string userid { get; set; }
        public string name { get; set; }
        public bool status { get; set; } // true = devam ediyor, false = tamamlandı
        public DateTimeOffset createddate { get; set; }
    }

    public class Projects_Add
    {
        public string userid { get; set; }
        public string name { get; set; }
        public bool status { get; set; } // true = devam ediyor, false = tamamlandı
        public DateTimeOffset createddate { get; set; }
    }

    public class Projects_Update
    {
        public string id { get; set; }
        public string name { get; set; }
        public bool status { get; set; }
    }

    public class Projects_Delete
    {
        public string id { get; set; }
    }
}
