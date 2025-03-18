package com.example.demo.controller

import com.example.demo.entity.User
import com.example.demo.repository.UserRepository
import jakarta.websocket.server.PathParam
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api") //定義API前綴會有 /api
class UserController(private val userRepository: UserRepository) {

    @GetMapping("/users") // /api/users
    fun getUsers(): List<User> = userRepository.findAll()

    @GetMapping("/user/{id}")
    fun getUser(@PathVariable id: String): ResponseEntity<User> {
        return userRepository.findById(id).map { user ->
            ResponseEntity.ok(user)// 找到回傳 200 OK
        }.orElse(ResponseEntity.notFound().build())
    }

    @PostMapping("/user")
    fun createUser(@RequestBody user: User): ResponseEntity<User> {
        // 將Request JSON 轉換成 User 物件後，儲存到資料庫
        val savedUser = userRepository.save(user)
        // 回傳 201 Created 狀態以及儲存後的資料
        return ResponseEntity.status(HttpStatus.CREATED).body(savedUser)
    }

    @PutMapping("/user/{id}")
    fun updateUser(@PathVariable id: String, @RequestBody user: User): ResponseEntity<User> {
        return if (userRepository.existsById(id)){
            // 若該使用者存在，則利用 copy() 方法將傳入的 user 物件的 id 設為 URL 中的 id
            val updatedUser = user.copy(id = id.toLong())
            // 儲存更新後的資料，並回傳 200 OK
            ResponseEntity.ok(userRepository.save(updatedUser))
        }else{
            ResponseEntity.notFound().build()
        }
    }

    @DeleteMapping("user/{id}")
    fun deleteUser(@PathVariable id: String): ResponseEntity<Unit> {
        return if (userRepository.existsById(id)){
            // 刪除指定 id 的 User
            userRepository.deleteById(id)
            // 回傳 204 No Content，表示刪除成功但無資料回傳
            ResponseEntity.noContent().build()
        }else {
            // 若找不到該使用者則回傳 404 Not Found
            ResponseEntity.notFound().build()
        }
    }


}