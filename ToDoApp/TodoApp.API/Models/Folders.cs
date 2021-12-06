namespace TodoApp.API.Models
{
    using System;
    public class Folders
    {
        public string id { get; set; }
        public string userid { get; set; }
        public string name { get; set; }
        public DateTimeOffset createddate { get; set; }
    }

    public class Folders_Add
    {
        public string userid { get; set; }
        public string name { get; set; }
        public DateTimeOffset createddate { get; set; }
    }

    public class Folders_Update
    {
        public string id { get; set; }
        public string name { get; set; }
    }

    public class Folders_Delete
    {
        public string id { get; set; }
    }
}
