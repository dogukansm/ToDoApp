namespace TodoApp.API.Models
{
    using System;
    public class FolderItems
    {
        public string id { get; set; }
        public string folderid { get; set; }
        public string projectid { get; set; }
        public bool status { get; set; } // true = ulaşılabilir | false = başka yere taşındı, burada ulaşılamaz
        public DateTimeOffset createddate { get; set; }
    }
    
    public class FolderItems_Add
    {
        public string folderid { get; set; }
        public string projectid { get; set; }
        public bool status { get; set; } // true = ulaşılabilir | false = başka yere taşındı, burada ulaşılamaz
        public DateTimeOffset createddate { get; set; }
    }
}
