<div id="instagram_posts"></div>

<script type="text/javascript">
    jQuery(document).ready(function(){
        window.getInstagram(
            "<?php echo get_option('siteurl'); ?>/wp-admin/admin-ajax.php?action=get_instagram",
            false,
            document.getElementById('instagram_posts'),
            12,
            'facebook'
        );
    });
</script>
