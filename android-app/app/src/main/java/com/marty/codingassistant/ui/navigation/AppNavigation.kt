package com.marty.codingassistant.ui.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import com.marty.codingassistant.ui.screens.HomeScreen
import com.marty.codingassistant.ui.screens.EditorScreen
import com.marty.codingassistant.ui.screens.TerminalScreen
import com.marty.codingassistant.ui.screens.SettingsScreen

sealed class Screen(val route: String) {
    object Home : Screen("home")
    object Editor : Screen("editor")
    object Terminal : Screen("terminal")
    object Settings : Screen("settings")
}

@Composable
fun AppNavigation(navController: NavHostController) {
    NavHost(
        navController = navController,
        startDestination = Screen.Home.route
    ) {
        composable(Screen.Home.route) {
            HomeScreen(navController)
        }
        composable(Screen.Editor.route) {
            EditorScreen(navController)
        }
        composable(Screen.Terminal.route) {
            TerminalScreen(navController)
        }
        composable(Screen.Settings.route) {
            SettingsScreen(navController)
        }
    }
}