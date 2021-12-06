using Couchbase;
using Couchbase.Management.Users;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TodoApp.API.Models;

namespace TodoApp.API.Controllers
{

    [ApiController]
    public class UsersController : ControllerBase
    {
        [HttpPost]
        [Route("api/[controller]/adduser")]
        public async Task<IActionResult> AddUser([FromBody] Users_Add request)
        {
            var cluster = await Cluster.ConnectAsync("couchbase://localhost", "Administrator", "dogukansm");
            var bucket = await cluster.BucketAsync("todoapp");
            var scope = await bucket.ScopeAsync("lists");
            var collection = await scope.CollectionAsync("users");

            await collection.UpsertAsync(Guid.NewGuid().ToString(), new Users_Add
            {
                roleid = request.roleid,
                fullname = request.fullname,
                username = request.username,
                email = request.email,
                pass = request.pass
            });

            return Ok();
        }

        [HttpPost]
        [Route("api/[controller]/updateuser")]
        public async Task<IActionResult> UpdateUser([FromBody] Users_Update request)
        {
            var cluster = await Cluster.ConnectAsync("couchbase://localhost", "Administrator", "dogukansm");
            var result = await cluster.QueryAsync<dynamic>(
                "UPDATE todoapp.lists.users t SET fullname=$fullname, username=$username, email=$email, pass=$pass Where meta(t).id=$id",
                options =>
                {
                    options.Parameter("fullname", request.fullname);
                    options.Parameter("username", request.username);
                    options.Parameter("email", request.email);
                    options.Parameter("pass", request.pass);
                    options.Parameter("id", request.id);
                }
            );

            return Ok();
        }

        [HttpPost]
        [Route("api/[controller]/deleteuser")]
        public async Task<IActionResult> DeleteUser([FromBody] Users_Delete request)
        {
            var cluster = await Cluster.ConnectAsync("couchbase://localhost", "Administrator", "dogukansm");
            var result = await cluster.QueryAsync<dynamic>(
                "DELETE FROM todoapp.lists.users t Where meta(t).id=$id",
                options => options.Parameter("id", request.id)
                );

            return Ok();
        }

        [HttpGet]
        [Route("api/[controller]/getusers")]
        public async Task<IActionResult> GetUsers()
        {
            var cluster = await Cluster.ConnectAsync("couchbase://localhost", "Administrator", "dogukansm");

            var result = await cluster.QueryAsync<dynamic>(
                "SELECT meta(t).id, t.* FROM todoapp.lists.users t"
            );

            List<Users> users = new List<Users>();

            int count = 0;
            await foreach (var row in result)
            {
                count++;
                users.Add(new Users
                {
                    id = row.id,
                    roleid = row.roleid,
                    fullname = row.fullname,
                    username = row.username,
                    email = row.email,
                    pass = row.pass
                });
            }

            if (count == 0)
            {
                return NotFound();
            }
            else
            {
                return Ok(users);
            }
        }

        [HttpGet]
        [Route("api/[controller]/login/{username}/{password}")]
        public async Task<IActionResult> Login(string username, string password)
        {
            var cluster = await Cluster.ConnectAsync("couchbase://localhost", "Administrator", "dogukansm");

            var result = await cluster.QueryAsync<dynamic>(
                "SELECT meta(t).id,t.* FROM todoapp.lists.users t Where t.username=$username and t.pass=$password",
                options =>
                {
                    options.Parameter("username", username);
                    options.Parameter("password", password);
                });

            int count = 0;

            string userid = "";
            await foreach (var row in result)
            {
                userid = row.id;
                count++;
            }

            if (count != 0)
            {
                List<dynamic> res = new List<dynamic>();
                res.Add(new
                {
                    title = "Login success",
                    userid = userid, 
                    status = "OK"
                });

                return Ok(res);
            }
            else
            {
                List<dynamic> res = new List<dynamic>();
                res.Add(new 
                {
                    title = "User not found!",
                    status = "Bad"
                });

                return NotFound(res);
            }


            
        }
    }
}
