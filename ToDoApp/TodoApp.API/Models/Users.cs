namespace TodoApp.API.Models
{
    using System;
    public class Users
    {
        public string id { get; set; }
        public string roleid { get; set; }
        public string fullname { get; set; }
        public string username { get; set; }
        public string email { get; set; }
        public string pass { get; set; }
    }

    public class Users_Add
    {
        public string roleid { get; set; }
        public string fullname { get; set; }
        public string username { get; set; }
        public string email { get; set; }
        public string pass { get; set; }
    }

    public class Users_Update
    {
        public string id { get; set; }
        public string fullname { get; set; }
        public string username { get; set; }
        public string email { get; set; }
        public string pass { get; set; }
    }

    public class Users_Delete
    {
        public string id { get; set; }
    }
}
