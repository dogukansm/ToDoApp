namespace TodoApp.API.Models
{
    using System;
    public class Roles
    {
        public string id { get; set; }
        public string title { get; set; }
        public bool isManager { get; set; }
    }

    public class Roles_Add
    {
        public string title { get; set; }
        public bool isManager { get; set; }
    }

    public class Roles_Update
    {
        public string id { get; set; }
        public string title { get; set; }
        public bool isManager { get; set; }
    }

    public class Roles_Delete
    {
        public string id { get; set; }
    }
}
