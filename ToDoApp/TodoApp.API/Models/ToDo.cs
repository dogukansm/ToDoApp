namespace TodoApp.API.Models
{
    using System;
    public class ToDo
    {
        public string id { get; set; }
        public string projectid { get; set; }
        public string name { get; set; }
        public string description { get; set; }
        public bool status { get; set; } // true = devam ediyor, false = tamamlandı
        public DateTimeOffset createddate { get; set; }
    }

    public class ToDo_Add
    {
        public string projectid { get; set; }
        public string name { get; set; }
        public string description { get; set; }
        public bool status { get; set; } // true = devam ediyor, false = tamamlandı
        public DateTimeOffset createddate { get; set; }
    }

    public class ToDo_Update
    {
        public string id { get; set; }
        public string name { get; set; }
        public string description { get; set; }
        public bool status { get; set; }
    }

    public class ToDo_Delete
    {
        public string id { get; set; }
    }
}
