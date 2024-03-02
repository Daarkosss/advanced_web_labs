<?php
/**
 * Plugin Name: Post Announcements
 * Description: Displays a random announcement at the beginning of each post.
 * Version: 1.0
 * Author: Karol Piłat, Szymon Wieczorek
 */


// Add menu in the administration panel
function post_announcements_menu() {
    add_options_page('Post Announcements Settings', 'Post Announcements', 'manage_options', 'post-announcements', 'post_announcements_settings_page');
}

add_action('admin_menu', 'post_announcements_menu');


// Setting page
function post_announcements_settings_page() {
    if (!current_user_can('manage_options')) {
        wp_die(__('You do not have sufficient permissions to access this page.'));
    }

    // Handle form save
    if (isset($_POST['announcements_content'])) {
        $announcements_content = array_map('trim', $_POST['announcements_content']);
        $announcements_content = array_filter($announcements_content); // Filter out blank announcements
        update_option('post_announcements_content', $announcements_content);
        echo '<div class="updated"><p>Announcements saved.</p></div>';
    }


    echo '<form method="post" action="">';
        echo '<div id="announcements">';
            $announcements = (array) get_option('post_announcements_content', []);
            foreach ($announcements as $index => $announcement) {
                echo '<div class="announcement">';
                echo '<textarea name="announcements_content[]" class="announcement-textarea">' . esc_textarea($announcement) . '</textarea>';
                echo '<button class="remove_announcement">Remove</button>';
                echo '</div>';
            }
        echo '</div>';
        echo '<button type="button" id="add_announcement">Add Announcement</button>';
        echo '<p><button type="submit" class="button-primary">Save Changes</button></p>';
    echo '</form>';
    
}


// Inject announcement into a post
function add_announcement_to_post($content) {
     # Check if it's a single post page
    if (is_single()) {
        $announcements = (array) get_option('post_announcements_content', '');
        if (!empty($announcements)) {
            $random_announcement = wp_kses_post($announcements[array_rand($announcements)]);
            $content = $random_announcement . $content;
        }
    }

    return $content;
}

add_filter('the_content', 'add_announcement_to_post');


// Add scripts to admin page
function post_announcements_admin_scripts() {
    wp_enqueue_script('post-announcements-script', plugins_url('script.js', __FILE__), array('jquery'), '1.0.0', true);
}

add_action('admin_enqueue_scripts', 'post_announcements_admin_scripts');


// Add styles to admin page
function post_announcements_register_styles() {
    //register style
    wp_register_style('post_announcements', plugins_url('/css/styles.css', __FILE__));

    //enable style (load in meta of html)
    wp_enqueue_style('post_announcements');
}

add_action('init', 'post_announcements_register_styles');
