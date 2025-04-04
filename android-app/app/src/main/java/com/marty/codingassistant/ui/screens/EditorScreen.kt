package com.marty.codingassistant.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun EditorScreen(navController: NavController) {
    var codeText by remember { mutableStateOf("// Start coding here\n") }
    var selectedLanguage by remember { mutableStateOf("kotlin") }
    var showLanguageMenu by remember { mutableStateOf(false) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Code Editor") },
                navigationIcon = {
                    IconButton(onClick = { navController.navigateUp() }) {
                        Icon(Icons.Default.ArrowBack, "Back")
                    }
                },
                actions = {
                    // Language selector
                    IconButton(onClick = { showLanguageMenu = true }) {
                        Icon(Icons.Default.Code, "Select Language")
                    }
                    // Run code button
                    IconButton(onClick = { /* Handle run code */ }) {
                        Icon(Icons.Default.PlayArrow, "Run Code")
                    }
                    // Save button
                    IconButton(onClick = { /* Handle save */ }) {
                        Icon(Icons.Default.Save, "Save")
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.primary,
                    titleContentColor = MaterialTheme.colorScheme.onPrimary,
                    navigationIconContentColor = MaterialTheme.colorScheme.onPrimary,
                    actionIconContentColor = MaterialTheme.colorScheme.onPrimary
                )
            )
        },
        bottomBar = {
            BottomAppBar(
                containerColor = MaterialTheme.colorScheme.primaryContainer,
                contentColor = MaterialTheme.colorScheme.onPrimaryContainer
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(8.dp),
                    horizontalArrangement = Arrangement.SpaceEvenly
                ) {
                    // Common coding symbols
                    TextButton(onClick = { codeText += "{" }) { Text("{") }
                    TextButton(onClick = { codeText += "}" }) { Text("}") }
                    TextButton(onClick = { codeText += "(" }) { Text("(") }
                    TextButton(onClick = { codeText += ")" }) { Text(")") }
                    TextButton(onClick = { codeText += ";" }) { Text(";") }
                    TextButton(onClick = { codeText += "=" }) { Text("=") }
                }
            }
        }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
        ) {
            // Language selection dropdown
            DropdownMenu(
                expanded = showLanguageMenu,
                onDismissRequest = { showLanguageMenu = false }
            ) {
                listOf("kotlin", "java", "python", "javascript").forEach { language ->
                    DropdownMenuItem(
                        text = { Text(language.capitalize()) },
                        onClick = {
                            selectedLanguage = language
                            showLanguageMenu = false
                        }
                    )
                }
            }

            // Code editor
            Surface(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(8.dp),
                color = MaterialTheme.colorScheme.surface
            ) {
                BasicTextField(
                    value = codeText,
                    onValueChange = { codeText = it },
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(8.dp),
                    textStyle = TextStyle(
                        fontFamily = FontFamily.Monospace,
                        fontSize = 14.sp,
                        color = MaterialTheme.colorScheme.onSurface
                    )
                )
            }
        }
    }
}