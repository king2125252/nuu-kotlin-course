package com.example.demo.controller

import com.example.demo.entity.User
import com.example.demo.repository.UserRepository
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class UserController(private val userRepository: UserRepository) {

    @GetMapping("/users")
    fun getUsers(): List<User> = userRepository.findAll()
}